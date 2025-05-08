import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    
    // Forward the request to our backend API
    const response = await fetch('http://localhost:8000/api/ml-scoring/compare-models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error comparing models:', error);
    return NextResponse.json(
      { 
        error: 'Failed to compare models', 
        message: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
} 