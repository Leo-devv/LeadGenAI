import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const datasetType = url.searchParams.get('dataset_type') || 'bank';
    const modelType = url.searchParams.get('model_type') || 'random_forest';
    
    // Forward the request to our backend API
    const response = await fetch(`http://localhost:8000/api/ml-scoring/train?dataset_type=${datasetType}&model_type=${modelType}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error training model:', error);
    return NextResponse.json(
      { 
        error: 'Failed to train model', 
        message: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
} 