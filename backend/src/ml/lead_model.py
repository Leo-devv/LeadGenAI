import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from .data_processor import DataProcessor

class LeadScoringModel:
    def __init__(self, dataset_type='bank'):
        """Initialize lead scoring model
        
        Args:
            dataset_type: Type of dataset to use ('bank' or 'lead_scoring')
        """
        self.dataset_type = dataset_type
        self.model = None
        self.encoder = None
        self.scaler = None
        self.metrics = None
        self.feature_importance = None
        self.cat_cols = None
        self.num_cols = None
    
    def train(self):
        """Train the lead scoring model"""
        processor = DataProcessor(dataset_type=self.dataset_type)
        train_df, test_df, cat_cols, num_cols = processor.load_and_prepare_data()
        
        self.cat_cols = cat_cols
        self.num_cols = num_cols
        
        print(f"Training model with {len(train_df)} samples, {len(cat_cols)} categorical and {len(num_cols)} numerical features")
        
        # Separate features and target
        X_train = train_df.drop('target', axis=1)
        y_train = train_df['target']
        X_test = test_df.drop('target', axis=1)
        y_test = test_df['target']
        
        # Create preprocessing pipeline
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), num_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
            ])
        
        # Create and train model
        self.model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        
        self.model.fit(X_train, y_train)
        
        # Calculate feature importance
        if hasattr(self.model.named_steps['classifier'], 'feature_importances_'):
            # Get feature names from the preprocessor
            cat_features = self.model.named_steps['preprocessor'].transformers_[1][1].get_feature_names_out(cat_cols)
            all_features = num_cols + list(cat_features)
            # Extract feature importances 
            importances = self.model.named_steps['classifier'].feature_importances_
            
            # If the lengths don't match, feature importance can't be mapped to feature names
            if len(importances) == len(all_features):
                self.feature_importance = pd.DataFrame({
                    'feature': all_features,
                    'importance': importances
                }).sort_values('importance', ascending=False)
                
                # Save feature importance to CSV
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                filename = 'lead_scoring_feature_importance.csv' if self.dataset_type == 'lead_scoring' else 'feature_importance.csv'
                csv_path = os.path.join(base_dir, 'data', filename)
                self.feature_importance.to_csv(csv_path, index=False)
                
        # Evaluate model
        self.evaluate(X_test, y_test)
        
        return self
    
    def predict(self, lead_data):
        """Predict lead score"""
        if self.model is None:
            raise Exception("Model not trained or loaded")
        
        # Prepare input data
        processor = DataProcessor(dataset_type=self.dataset_type)
        processed_data = processor.transform_input_data(lead_data, self.dataset_type)
        
        input_df = pd.DataFrame([processed_data])
        prediction = self.model.predict(input_df)[0]
        probability = self.model.predict_proba(input_df)[0][1]
        
        # Convert score to 0-100 range for UI
        score = int(prediction * 100)
        
        # Determine status based on probability
        if probability >= 0.7:
            status = "hot"
        elif probability >= 0.4:
            status = "warm"
        else:
            status = "cold"
            
        return {
            "score": score, 
            "probability": float(probability),
            "status": status
        }
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        preds = self.model.predict(X_test)
        proba = self.model.predict_proba(X_test)[:, 1]
        
        self.metrics = {
            "accuracy": float(accuracy_score(y_test, preds)),
            "precision": float(precision_score(y_test, preds)),
            "recall": float(recall_score(y_test, preds)),
            "f1": float(f1_score(y_test, preds)),
            "roc_auc": float(roc_auc_score(y_test, proba))
        }
        
        # Save metrics to JSON
        import json
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        filename = 'lead_scoring_model_metrics.json' if self.dataset_type == 'lead_scoring' else 'model_metrics.json'
        json_path = os.path.join(base_dir, 'data', filename)
        
        with open(json_path, 'w') as f:
            json.dump(self.metrics, f)
        
        return self.metrics
    
    def save_model(self, filename=None):
        """Save model to disk"""
        if self.model is None:
            raise Exception("No model to save")
        
        if filename is None:
            filename = 'lead_scoring_model.pkl'
        
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, 'data', filename)
        
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        # Also save model config
        config = {
            'dataset_type': self.dataset_type,
            'cat_cols': self.cat_cols,
            'num_cols': self.num_cols
        }
        
        config_path = os.path.join(base_dir, 'data', 'lead_scoring_model_config.json')
        import json
        with open(config_path, 'w') as f:
            json.dump(config, f)
            
        print(f"Model saved to {model_path}")
        return self
    
    def load_model(self, filename=None):
        """Load model from disk"""
        if filename is None:
            filename = 'lead_scoring_model.pkl'
            
        # Check if path is absolute or relative
        if os.path.isabs(filename):
            model_path = filename
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            model_path = os.path.join(base_dir, 'data', filename)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
            
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            # Try to load config
            config_path = os.path.join(os.path.dirname(model_path), 'lead_scoring_model_config.json')
            if os.path.exists(config_path):
                import json
                with open(config_path, 'r') as f:
                    config = json.load(f)
                    self.dataset_type = config.get('dataset_type', self.dataset_type)
                    self.cat_cols = config.get('cat_cols')
                    self.num_cols = config.get('num_cols')
            
            # Try to load metrics
            metrics_filename = 'lead_scoring_model_metrics.json' if self.dataset_type == 'lead_scoring' else 'model_metrics.json'
            metrics_path = os.path.join(os.path.dirname(model_path), metrics_filename)
            if os.path.exists(metrics_path):
                import json
                with open(metrics_path, 'r') as f:
                    self.metrics = json.load(f)
            
            print(f"Model loaded from {model_path}")
            return self
        except Exception as e:
            raise Exception(f"Error loading model: {str(e)}") 