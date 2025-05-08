#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

class DataProcessor:
    def __init__(self, data_path=None, dataset_type='bank'):
        """
        Initialize data processor
        
        Args:
            data_path: Path to the data file
            dataset_type: Type of dataset ('bank' or 'lead_scoring')
        """
        self.data_path = data_path or self._get_default_path(dataset_type)
        self.dataset_type = dataset_type
        
    def _get_default_path(self, dataset_type):
        """Get default data path based on dataset type"""
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        if dataset_type == 'bank':
            return os.path.join(base_dir, 'data', 'bank-additional-full.csv')
        elif dataset_type == 'lead_scoring':
            return os.path.join(base_dir, 'data', 'Lead Scoring.csv')
        else:
            raise ValueError(f"Unknown dataset type: {dataset_type}")
    
    def load_and_prepare_data(self):
        """Load and prepare dataset based on type"""
        print(f"Loading {self.dataset_type} data from {self.data_path}")
        
        if self.dataset_type == 'bank':
            return self._prepare_bank_data()
        elif self.dataset_type == 'lead_scoring':
            return self._prepare_lead_scoring_data()
        else:
            raise ValueError(f"Unknown dataset type: {self.dataset_type}")
    
    def _prepare_bank_data(self):
        """Prepare bank marketing dataset"""
        # Load the dataset - using semicolon as separator
        df = pd.read_csv(self.data_path, sep=';')
        
        # Map the target variable to binary (1 for 'yes', 0 for 'no')
        df['y'] = df['y'].map({'yes': 1, 'no': 0})
        target_col = 'y'
        
        # Identify categorical features (object type columns)
        cat_cols = df.select_dtypes(include=['object']).columns.tolist()
        cat_cols.remove(target_col)  # Remove target from categorical columns
        num_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        
        print(f"Categorical features: {cat_cols}")
        print(f"Numeric features: {num_cols}")
        
        # Split data into training and test sets
        X_train, X_test, y_train, y_test = train_test_split(
            df.drop(target_col, axis=1), 
            df[target_col], 
            test_size=0.2, 
            random_state=42
        )
        
        # Combine X and y for PyTorch Tabular
        train_df = pd.concat([X_train, y_train.rename('target')], axis=1)
        test_df = pd.concat([X_test, y_test.rename('target')], axis=1)
        
        return train_df, test_df, cat_cols, num_cols
    
    def _prepare_lead_scoring_data(self):
        """Prepare lead scoring dataset"""
        # Load the dataset
        df = pd.read_csv(self.data_path)
        
        # Define target column
        target_col = 'Converted'
        
        # Handle missing values
        df.fillna({
            'TotalVisits': 0,
            'Total Time Spent on Website': 0,
            'Page Views Per Visit': 0
        }, inplace=True)
        
        # Fill remaining NA values with mode for categorical and mean for numerical
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col].fillna(df[col].mode()[0], inplace=True)
            else:
                df[col].fillna(df[col].mean(), inplace=True)
        
        # Drop columns that are not useful for prediction
        drop_cols = ['Prospect ID', 'Lead Number']
        df = df.drop(drop_cols, axis=1)
        
        # Convert categorical columns to categories
        cat_cols = df.select_dtypes(include=['object']).columns.tolist()
        if target_col in cat_cols:
            cat_cols.remove(target_col)
            
        num_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        if target_col in num_cols:
            num_cols.remove(target_col)
        
        print(f"Categorical features: {cat_cols}")
        print(f"Numeric features: {num_cols}")
        
        # Split data into training and test sets
        X_train, X_test, y_train, y_test = train_test_split(
            df.drop(target_col, axis=1), 
            df[target_col], 
            test_size=0.2, 
            random_state=42
        )
        
        # Combine X and y for PyTorch Tabular
        train_df = pd.concat([X_train, y_train.rename('target')], axis=1)
        test_df = pd.concat([X_test, y_test.rename('target')], axis=1)
        
        return train_df, test_df, cat_cols, num_cols
        
    def transform_input_data(self, lead_data, dataset_type=None):
        """Transform input data to match model's expected format"""
        dataset_type = dataset_type or self.dataset_type
        
        if dataset_type == 'bank':
            return self._transform_bank_data(lead_data)
        elif dataset_type == 'lead_scoring':
            return self._transform_lead_scoring_data(lead_data)
        else:
            raise ValueError(f"Unknown dataset type: {dataset_type}")
    
    def _transform_bank_data(self, lead_data):
        """Transform input data for bank model"""
        # Create a copy to avoid modifying the original
        transformed_data = dict(lead_data)
        
        # Format field names to match what the model expects
        try:
            # Handle field name transformations if needed
            if "emp_var_rate" in transformed_data and "emp.var.rate" not in transformed_data:
                transformed_data["emp.var.rate"] = transformed_data.pop("emp_var_rate")
            
            if "cons_price_idx" in transformed_data and "cons.price.idx" not in transformed_data:
                transformed_data["cons.price.idx"] = transformed_data.pop("cons_price_idx")
            
            if "cons_conf_idx" in transformed_data and "cons.conf.idx" not in transformed_data:
                transformed_data["cons.conf.idx"] = transformed_data.pop("cons_conf_idx")
            
            if "nr_employed" in transformed_data and "nr.employed" not in transformed_data:
                transformed_data["nr.employed"] = transformed_data.pop("nr_employed")
                
            # Remove fields not needed for the model to avoid errors
            fields_to_remove = ["name", "email", "phone", "company", "source", 
                               "budget", "authority", "need", "timeframe", 
                               "engagement_level", "website_visits", "time_spent", 
                               "content_downloaded", "model_type", "dataset_type"]
            
            for field in fields_to_remove:
                if field in transformed_data:
                    transformed_data.pop(field)
        except Exception as e:
            print(f"Warning in transform_bank_data: {e}")
        
        return transformed_data
    
    def _transform_lead_scoring_data(self, lead_data):
        """Transform input data for lead scoring model"""
        # Create a copy to avoid modifying the original
        transformed_data = dict(lead_data)
        
        try:
            # Rename fields if needed to match model expectations
            field_mapping = {
                "engagement_level": "engagement",
                "website_visits": "visits",
                "time_spent": "time_on_site",
                "content_downloaded": "downloads"
            }
            
            for old_name, new_name in field_mapping.items():
                if old_name in transformed_data:
                    transformed_data[new_name] = transformed_data.pop(old_name)
            
            # Remove fields not relevant to lead scoring model
            fields_to_remove = ["emp_var_rate", "cons_price_idx", "cons_conf_idx", 
                               "euribor3m", "nr_employed", "model_type", "dataset_type"]
            
            for field in fields_to_remove:
                if field in transformed_data:
                    transformed_data.pop(field)
        except Exception as e:
            print(f"Warning in transform_lead_scoring_data: {e}")
        
        return transformed_data 