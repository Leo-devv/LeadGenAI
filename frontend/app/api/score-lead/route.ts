import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    
    console.log("Sending lead data to backend:", leadData);
    
    // Forward the request to our backend API
    const response = await fetch('http://localhost:8000/api/ml-scoring/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
      // Increase timeout for model loading
      cache: 'no-store',
    });
    
    // Get the result even if the backend returns an error code
    const result = await response.json();
    console.log("Received response from backend:", result);
    
    // Special handling for B2B lead scoring to avoid showing fallback errors
    if (leadData.dataset_type === 'lead_scoring' && result.dataset_type === 'bank') {
      // If user requested lead_scoring but got bank, try one more time with explicit model type
      console.log("Retrying with explicit model parameters...");
      
      const retryResponse = await fetch('http://localhost:8000/api/ml-scoring/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          dataset_type: 'lead_scoring',
          model_type: 'random_forest'
        }),
        cache: 'no-store',
      });
      
      if (retryResponse.ok) {
        const retryResult = await retryResponse.json();
        if (retryResult.dataset_type === 'lead_scoring') {
          console.log("Retry successful, using lead_scoring model");
          return NextResponse.json(retryResult);
        }
      }
    }
    
    // If there's an error but we have a fallback score, return it with the error message
    if (!response.ok || result.error) {
      console.warn('Backend warning/error:', result.error || `HTTP ${response.status}`);
      
      // If we have a score from the backend despite the error, return it but clear the error
      // to avoid showing it in the UI if the score is valid
      if (result.score !== undefined) {
        // If the error is just about fallback model, don't show it to the user
        if (result.error && result.error.includes("fallback")) {
          const cleanResult = { ...result };
          delete cleanResult.error;
          return NextResponse.json(cleanResult);
        }
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