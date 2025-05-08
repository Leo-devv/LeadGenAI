import os
import numpy as np
import pandas as pd
from pytorch_tabnet.tab_model import TabNetClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from .data_processor import DataProcessor

class TabNetLeadScoringModel:
    def __init__(self, data_path=None):
        self.data_path = data_path
        self.model = None
        self.cat_cols = None
        self.num_cols = None
        self.metrics = None
        self.trained = False

    def train(self):
        processor = DataProcessor(self.data_path, dataset_type='lead_scoring')
        train_df, test_df, cat_cols, num_cols = processor.load_and_prepare_data()
        self.cat_cols = cat_cols
        self.num_cols = num_cols

        X_train = train_df.drop('target', axis=1)
        y_train = train_df['target'].values
        X_test = test_df.drop('target', axis=1)
        y_test = test_df['target'].values

        # Encode categorical columns
        for col in cat_cols:
            X_train[col] = X_train[col].astype('category').cat.codes
            X_test[col] = X_test[col].astype('category').cat.codes

        self.model = TabNetClassifier()
        self.model.fit(
            X_train.values, y_train,
            eval_set=[(X_test.values, y_test)],
            patience=10, max_epochs=100, batch_size=1024, virtual_batch_size=128,
            eval_metric=['accuracy']
        )
        self.trained = True
        self.evaluate(X_test, y_test)

    def predict(self, input_data):
        if not self.trained:
            raise Exception('Model not trained!')
        # Prepare input as DataFrame
        df = pd.DataFrame([input_data])
        for col in self.cat_cols:
            if col in df:
                df[col] = df[col].astype('category').cat.codes
        for col in self.num_cols:
            if col in df:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        pred = self.model.predict(df.values)[0]
        proba = self.model.predict_proba(df.values)[0][1]
        return {
            'score': int(pred),
            'probability': float(proba),
            'status': 'converted' if pred == 1 else 'not_converted',
        }

    def evaluate(self, X_test, y_test):
        preds = self.model.predict(X_test.values)
        probas = self.model.predict_proba(X_test.values)[:, 1]
        self.metrics = {
            'accuracy': accuracy_score(y_test, preds),
            'precision': precision_score(y_test, preds),
            'recall': recall_score(y_test, preds),
            'f1': f1_score(y_test, preds),
            'roc_auc': roc_auc_score(y_test, probas)
        }
        return self.metrics 