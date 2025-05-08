from fastapi import APIRouter, HTTPException
import os
import sys
import json
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.lead_model import LeadScoringModel
from ml.data_processor import DataProcessor
from ml.tabnet_model import TabNetLeadScoringModel

router = APIRouter()

# Initialize the models
lead_scoring_model = None
lead_scoring_model_bank = None
lead_scoring_tabnet_model = None

# Check if the Bank model exists and load it
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'lead_scoring_model.pkl')
if os.path.exists(model_path):
    try:
        lead_scoring_model_bank = LeadScoringModel()
        lead_scoring_model_bank.load_model(model_path)
        print(f"Loaded existing bank model from {model_path}")
    except Exception as e:
        print(f"Error loading bank model: {str(e)}")
else:
    print(f"Bank model not found at {model_path}, will be created when requested")

# Check if the Lead Scoring model exists and load it
lead_model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'lead_scoring_custom_model.pkl')
if os.path.exists(lead_model_path):
    try:
        lead_scoring_model = LeadScoringModel('lead_scoring')
        lead_scoring_model.load_model(lead_model_path)
        print(f"Loaded existing lead scoring model from {lead_model_path}")
    except Exception as e:
        print(f"Error loading lead scoring model: {str(e)}")
else:
    print(f"Lead scoring model not found at {lead_model_path}, will be created when requested")

# Pydantic models for request and response
class LeadData(BaseModel):
    # Common personal information
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = None
    
    # Bank dataset fields
    age: Optional[int] = None
    job: Optional[str] = None
    marital: Optional[str] = None
    education: Optional[str] = None
    default: Optional[str] = None
    housing: Optional[str] = None
    loan: Optional[str] = None
    contact: Optional[str] = None
    month: Optional[str] = None
    day_of_week: Optional[str] = None
    duration: Optional[int] = None
    campaign: Optional[int] = None
    pdays: Optional[int] = None
    previous: Optional[int] = None
    poutcome: Optional[str] = None
    
    # Economic indicators for bank dataset
    emp_var_rate: Optional[float] = None   # Employment Variation Rate
    cons_price_idx: Optional[float] = None  # Consumer Price Index
    cons_conf_idx: Optional[float] = None   # Consumer Confidence Index
    euribor3m: Optional[float] = None       # Euribor 3 Month Rate
    nr_employed: Optional[float] = None     # Number of Employees
    
    # Lead scoring dataset fields (BANT framework)
    budget: Optional[float] = None
    authority: Optional[float] = None
    need: Optional[float] = None
    timeframe: Optional[float] = None
    
    # Engagement metrics for lead scoring
    engagement_level: Optional[float] = None
    website_visits: Optional[int] = None
    time_spent: Optional[float] = None
    content_downloaded: Optional[int] = None
    
    # Model selection
    dataset_type: Optional[str] = "bank"  # Default to bank, can be "lead_scoring"
    model_type: Optional[str] = "random_forest"  # Can be "transformer" or "random_forest"

class ScoringResponse(BaseModel):
    score: int
    probability: float
    status: str
    dataset_type: Optional[str] = None
    error: Optional[str] = None

class ModelMetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    dataset_type: Optional[str] = None

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

@router.post("/score", response_model=ScoringResponse)
async def score_lead(lead: LeadData):
    """Score a lead using the trained ML model"""
    global lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model
    
    # Log the incoming request data
    print("\n----- INCOMING LEAD SCORING REQUEST -----")
    print(f"Lead data: {lead.model_dump()}")
    print(f"Using dataset type: {lead.dataset_type}")
    
    # Determine which model to use
    dataset_type = lead.dataset_type.lower() if lead.dataset_type else "bank"
    requested_dataset_type = dataset_type  # Save the originally requested dataset type
    
    # Format lead data
    lead_dict = lead.model_dump()
    
    # Remove dataset_type from lead data before sending to model
    if "dataset_type" in lead_dict:
        lead_dict.pop("dataset_type")
    
    # Format field names to match what the model expects
    try:
        # Add both formats to ensure compatibility
        if "emp_var_rate" in lead_dict:
            # Add dot notation versions
            lead_dict["emp.var.rate"] = lead_dict["emp_var_rate"]
            lead_dict["cons.price.idx"] = lead_dict["cons_price_idx"]
            lead_dict["cons.conf.idx"] = lead_dict["cons_conf_idx"]
            lead_dict["nr.employed"] = lead_dict["nr_employed"]
        elif "emp.var.rate" in lead_dict:
            # Add underscore versions
            lead_dict["emp_var_rate"] = lead_dict["emp.var.rate"]
            lead_dict["cons_price_idx"] = lead_dict["cons.price.idx"]
            lead_dict["cons_conf_idx"] = lead_dict["cons.conf.idx"]
            lead_dict["nr_employed"] = lead_dict["nr.employed"]
        
        print(f"Reformatted lead data: {lead_dict}")
    except KeyError as e:
        print(f"Field name conversion error: {str(e)}")
        # Fields might already be in the expected format
        pass
    
    error_message = None
    
    # Choose appropriate model based on dataset_type
    model_type = getattr(lead, 'model_type', 'random_forest').lower()
    if dataset_type == "lead_scoring":
        if model_type == "transformer":
            if lead_scoring_tabnet_model is None:
                try:
                    print("Creating and training new TabNet transformer model...")
                    lead_scoring_tabnet_model = TabNetLeadScoringModel()
                    lead_scoring_tabnet_model.train()
                    print("TabNet model created and trained successfully")
                except Exception as e:
                    error_msg = f"TabNet model not trained or loaded: {str(e)}"
                    print(f"ERROR: {error_msg}")
                    dataset_type = "bank"
                    error_message = error_msg
            selected_model = lead_scoring_tabnet_model
        else:
            if lead_scoring_model is None:
                try:
                    print("Creating and training new lead scoring model...")
                    lead_scoring_model = LeadScoringModel('lead_scoring')
                    lead_scoring_model.train()
                    lead_scoring_model.save_model('lead_scoring_custom_model.pkl')
                    print("Lead scoring model created and trained successfully")
                except Exception as e:
                    error_msg = f"Model not trained or loaded: {str(e)}"
                    print(f"ERROR: {error_msg}")
                    dataset_type = "bank"
                    error_message = error_msg
            selected_model = lead_scoring_model
    else:
        # Use bank model
        selected_model = lead_scoring_model_bank
    
    # Ensure we have a valid model to use
    if selected_model is None:
        print("No valid model available, using default fallback")
        # Return a default score if no model is available
        return ScoringResponse(
            score=50,
            probability=0.5,
            status="warm",
            dataset_type=requested_dataset_type,
            error="No valid model available for scoring"
        )
    
    # Make prediction
    try:
        # Make prediction with selected model
        result = selected_model.predict(lead_dict)
        
        # Add dataset type information
        result['dataset_type'] = dataset_type
        
        # Add error message if we had to fall back
        if error_message and dataset_type != requested_dataset_type:
            result['error'] = error_message
                
        print(f"Prediction result: {result}")
        print("----- END OF REQUEST -----\n")
        return result
    except Exception as e:
        error_msg = f"Error scoring lead: {str(e)}"
        print(f"ERROR: {error_msg}")
        print("----- END OF REQUEST (WITH ERROR) -----\n")
        return ScoringResponse(
            score=50,
            probability=0.5,
            status="warm",
            dataset_type=requested_dataset_type,
            error=error_msg
        )

@router.get("/train", response_model=ModelMetricsResponse)
async def train_model(dataset_type: str = "bank", model_type: str = "random_forest"):
    """Train or retrain the lead scoring model"""
    global lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model
    
    try:
        if dataset_type.lower() == "lead_scoring":
            if model_type == "transformer":
                lead_scoring_tabnet_model = TabNetLeadScoringModel()
                lead_scoring_tabnet_model.train()
                metrics = lead_scoring_tabnet_model.metrics
                metrics['dataset_type'] = 'lead_scoring'
                return metrics
            else:
                lead_scoring_model = LeadScoringModel('lead_scoring')
                lead_scoring_model.train()
                lead_scoring_model.save_model('lead_scoring_custom_model.pkl')
                metrics = lead_scoring_model.metrics
                metrics['dataset_type'] = 'lead_scoring'
                return metrics
        else:
            lead_scoring_model_bank = LeadScoringModel()
            lead_scoring_model_bank.train()
            lead_scoring_model_bank.save_model()
            metrics = lead_scoring_model_bank.metrics
            metrics['dataset_type'] = 'bank'
            return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@router.get("/metrics", response_model=ModelMetricsResponse)
async def get_model_metrics(dataset_type: str = "bank"):
    """Get the current model metrics"""
    global lead_scoring_model, lead_scoring_model_bank
    
    if dataset_type.lower() == "lead_scoring" and lead_scoring_model is not None:
        if not hasattr(lead_scoring_model, 'metrics') or not lead_scoring_model.metrics:
            raise HTTPException(status_code=404, detail="Lead scoring model metrics not available")
        metrics = lead_scoring_model.metrics
        metrics['dataset_type'] = 'lead_scoring'
        return metrics
    else:
        if lead_scoring_model_bank is None or not hasattr(lead_scoring_model_bank, 'metrics') or not lead_scoring_model_bank.metrics:
            raise HTTPException(status_code=404, detail="Bank model metrics not available")
        metrics = lead_scoring_model_bank.metrics
        metrics['dataset_type'] = 'bank'
        return metrics

@router.get("/feature-importance", response_model=List[FeatureImportanceItem])
async def get_feature_importance(dataset_type: str = "bank"):
    """Get the feature importance from the model"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    filename = 'feature_importance.csv' if dataset_type.lower() != "lead_scoring" else 'lead_scoring_feature_importance.csv'
    
    feature_importance_path = os.path.join(base_dir, 'data', filename)
    
    if not os.path.exists(feature_importance_path):
        raise HTTPException(status_code=404, detail=f"Feature importance data not available for {dataset_type} dataset")
    
    try:
        import pandas as pd
        df = pd.read_csv(feature_importance_path)
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving feature importance: {str(e)}")

@router.get("/sample")
async def get_sample_lead():
    """Get a sample lead for testing"""
    return {
        "age": 35,
        "job": "management",
        "marital": "married",
        "education": "tertiary",
        "default": "no",
        "housing": "yes",
        "loan": "no",
        "contact": "cellular",
        "month": "may",
        "day_of_week": "mon",
        "duration": 180,
        "campaign": 2,
        "pdays": 999,
        "previous": 0,
        "poutcome": "nonexistent",
        "emp_var_rate": -1.8,
        "cons_price_idx": 92.89,
        "cons_conf_idx": -46.2,
        "euribor3m": 1.3,
        "nr_employed": 5099.1
    }

@router.get("/compare-models")
async def compare_models_get():
    """Compare predictions using both datasets with default data"""
    return await compare_models_internal(None)

@router.post("/compare-models")
async def compare_models_post(lead_data: Dict[str, Any]):
    """Compare predictions using both datasets with provided data"""
    return await compare_models_internal(lead_data)

async def compare_models_internal(lead_data: Optional[Dict[str, Any]] = None):
    """Compare predictions using both datasets"""
    global lead_scoring_model, lead_scoring_model_bank
    
    # Use sample data if none provided
    if lead_data is None:
        lead_data = {
            "age": 35,
            "job": "management",
            "marital": "married",
            "education": "tertiary",
            "default": "no",
            "housing": "yes",
            "loan": "no",
            "contact": "cellular",
            "month": "may",
            "day_of_week": "mon",
            "duration": 180,
            "campaign": 2,
            "pdays": 999,
            "previous": 0,
            "poutcome": "nonexistent",
            "emp.var.rate": -1.8,
            "cons.price.idx": 92.89,
            "cons.conf.idx": -46.2,
            "euribor3m": 1.3,
            "nr.employed": 5099.1
        }
    
    # Format field names to match what the model expects
    try:
        # Add both formats to ensure compatibility
        if "emp_var_rate" in lead_data and "emp.var.rate" not in lead_data:
            # Add dot notation versions
            lead_data["emp.var.rate"] = lead_data["emp_var_rate"]
            lead_data["cons.price.idx"] = lead_data["cons_price_idx"]
            lead_data["cons.conf.idx"] = lead_data["cons_conf_idx"]
            lead_data["nr.employed"] = lead_data["nr_employed"]
        elif "emp.var.rate" in lead_data and "emp_var_rate" not in lead_data:
            # Add underscore versions
            lead_data["emp_var_rate"] = lead_data["emp.var.rate"]
            lead_data["cons_price_idx"] = lead_data["cons.price.idx"]
            lead_data["cons_conf_idx"] = lead_data["cons.conf.idx"]
            lead_data["nr_employed"] = lead_data["nr.employed"]
            
        # Remove dataset_type if present
        if "dataset_type" in lead_data:
            lead_data.pop("dataset_type")
    except Exception as e:
        print(f"Field name conversion error: {str(e)}")
    
    # Results dictionary
    results = {
        "lead_data": lead_data
    }
    
    # Bank model prediction
    if lead_scoring_model_bank is None:
        try:
            print("Creating and training new bank model...")
            lead_scoring_model_bank = LeadScoringModel()
            lead_scoring_model_bank.train()
            lead_scoring_model_bank.save_model()
            print("Bank model created and trained successfully")
        except Exception as e:
            results["bank_model"] = {"error": f"Bank model not available: {str(e)}"}
    
    if lead_scoring_model_bank is not None:
        try:
            bank_result = lead_scoring_model_bank.predict(lead_data)
            bank_result['dataset_type'] = 'bank'
            results["bank_model"] = bank_result
        except Exception as e:
            results["bank_model"] = {"error": f"Bank model prediction error: {str(e)}"}
    
    # Lead scoring model prediction
    if lead_scoring_model is None:
        try:
            lead_scoring_model_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'lead_scoring_custom_model.pkl')
            
            if os.path.exists(lead_scoring_model_file):
                print(f"Loading existing lead scoring model from {lead_scoring_model_file}")
                lead_scoring_model = LeadScoringModel('lead_scoring')
                lead_scoring_model.load_model('lead_scoring_custom_model.pkl')
            else:
                print("Creating and training new lead scoring model...")
                lead_scoring_model = LeadScoringModel('lead_scoring')
                lead_scoring_model.train()
                lead_scoring_model.save_model('lead_scoring_custom_model.pkl')
                print("Lead scoring model created and trained successfully")
        except Exception as e:
            # Log the error but allow comparison to continue with bank model only
            error_msg = f"Lead scoring model not available: {str(e)}"
            print(error_msg)
            results["lead_scoring_model"] = {"error": error_msg}
            # Return early with what we have
            return results
    
    if lead_scoring_model is not None:
        try:
            lead_result = lead_scoring_model.predict(lead_data)
            lead_result['dataset_type'] = 'lead_scoring'
            results["lead_scoring_model"] = lead_result
        except Exception as e:
            results["lead_scoring_model"] = {"error": f"Lead scoring model prediction error: {str(e)}"}
    
    # Return comparison
    return results 