import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    
    // Forward the request to our backend API
    const response = await fetch('http://localhost:8000/api/ml-scoring/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    
    // Get the result even if the backend returns an error code
    // This is because the backend may return a fallback score even when there's an error
    const result = await response.json();
    
    // If there's an error but we have a fallback score, return it with the error message
    if (!response.ok || result.error) {
      console.warn('Backend warning/error:', result.error || `HTTP ${response.status}`);
      
      // If we have a score from the backend despite the error, return it
      if (result.score !== undefined) {
        return NextResponse.json(result);
      }
      
      // Otherwise, throw an error to be caught below
      throw new Error(result.error || `Error: ${response.status}`);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scoring lead:', error);
    
    // Provide a fallback score with an error message
    return NextResponse.json(
      { 
        error: 'Failed to score lead', 
        message: error instanceof Error ? error.message : String(error),
        score: 50,
        probability: 0.5,
        status: 'warm',
        dataset_type: 'bank' // Default to bank as fallback
      }, 
      { status: 200 } // Return 200 even for errors since we're providing a fallback
    );
  }
} 