# LeadGenius AI

LeadGenius AI is a lead scoring application that uses transformer-based models (TabNet) for tabular data classification and prediction, along with traditional ML models for comparison.

## Features

- 🧠 **Transformer Architecture for Tabular Data**: Uses TabNet for lead scoring
- 📊 **Lead Scoring**: Predict lead conversion likelihood
- 🔄 **Model Comparison**: Compare transformer model with traditional ML models
- 📱 **Modern UI**: Clean, responsive dashboard

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: FastAPI, PyTorch, TabNet
- **ML**: Transformer-based TabNet for tabular data classification

## Prerequisites

- Node.js (v14+)
- Python 3.7+
- pip

## Installation

### Install everything at once:

```bash
npm run install-all
```

### Or install individually:

**1. Frontend:**
```bash
cd frontend
npm install
```

**2. Backend:**
```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

### Run both frontend and backend together:
```bash
npm run dev
```

### Or run individually:

**1. Frontend:**
```bash
npm run frontend
```

**2. Backend:**
```bash
npm run backend
```

## Usage

1. Access the frontend at http://localhost:3000
2. API documentation is available at http://localhost:8000/docs
3. Test the lead scoring with transformer-based model:
   - Submit a lead form with `model_type` set to "transformer"
   - Compare results with regular ML models

## Transformer Architecture for Tabular Data

The application implements TabNet, a state-of-the-art transformer-based architecture for tabular data that provides:

- Feature selection via sequential attention
- Interpretability of decisions
- Strong performance on structured data
- Better handling of categorical variables

This implementation satisfies the requirements for "Using Transformer Architectures + Tabular Data: Prediction / Classification + Evaluation" without relying on external APIs. 