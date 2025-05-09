import os
from ml.lead_model import LeadScoringModel
from ml.tabnet_model import TabNetLeadScoringModel

# Global model instances
lead_scoring_model = None
lead_scoring_model_bank = None
lead_scoring_tabnet_model = None

def ensure_data_directory():
    """Ensure the data directory exists"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    return data_dir

def initialize_models():
    """Initialize and train all models"""
    global lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model
    
    data_dir = ensure_data_directory()
    
    try:
        # Skip bank model training as we don't have the dataset
        print("Skipping bank model training as dataset is not available")
        
        # Initialize and train lead scoring model if needed
        lead_model_path = os.path.join(data_dir, 'lead_scoring_custom_model.pkl')
        if not os.path.exists(lead_model_path):
            print("Training lead scoring model...")
            lead_scoring_model = LeadScoringModel('lead_scoring')
            lead_scoring_model.train()
            lead_scoring_model.save_model('lead_scoring_custom_model.pkl')
        else:
            print(f"Loading existing lead scoring model from {lead_model_path}")
            lead_scoring_model = LeadScoringModel('lead_scoring')
            lead_scoring_model.load_model(lead_model_path)
        
        # Initialize and train TabNet model
        print("Training TabNet model...")
        lead_scoring_tabnet_model = TabNetLeadScoringModel()
        lead_scoring_tabnet_model.train()
        
        print("All models initialized and trained successfully")
        return lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model
    except Exception as e:
        print(f"Error initializing models: {str(e)}")
        print("Starting FastAPI server anyway...")
        return None, None, None

def get_models():
    """Get initialized model instances"""
    global lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model
    return lead_scoring_model, lead_scoring_model_bank, lead_scoring_tabnet_model

if __name__ == "__main__":
    initialize_models() 