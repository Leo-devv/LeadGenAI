from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from routes.ml_scoring import router as ml_scoring_router, load_models
from initialize_models import initialize_models, get_models

# Initialize FastAPI app
app = FastAPI(
    title="LeadGenius AI Backend",
    description="Backend API for LeadGenius AI with TabNet transformer model for lead scoring",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models on startup
@app.on_event("startup")
async def startup_event():
    # Initialize models and make them available
    lead_model, bank_model, tabnet_model = initialize_models()
    
    # Update the models in the routes
    from routes.ml_scoring import update_models
    update_models(lead_model, bank_model, tabnet_model)

# Include routers
app.include_router(ml_scoring_router, prefix="/api/ml-scoring", tags=["ML Scoring"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to LeadGenius AI API",
        "docs": "/docs",
        "models": ["random_forest", "transformer"],
        "datasets": ["bank", "lead_scoring"]
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 