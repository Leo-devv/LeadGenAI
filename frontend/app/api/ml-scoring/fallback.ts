/**
 * This module provides fallback scoring logic for when the backend model fails
 * It implements a simple BANT (Budget, Authority, Need, Timeframe) analysis
 * to provide at least some meaningful scoring when the backend is unavailable
 */

type LeadData = {
  [key: string]: any;
};

export function getLocalBantScore(leadData: LeadData): {
  score: number;
  probability: number;
  status: string;
  dataset_type: string;
  error?: string;
} {
  // Set initial score
  let totalScore = 50; // Start with neutral score
  let factors = 0;
  
  // Create the error message
  const errorMessage = "Using local fallback scoring as backend model is unavailable.";
  
  // Check for BANT factors (Budget, Authority, Need, Timeframe)
  if (typeof leadData.budget === 'number') {
    totalScore += leadData.budget * 20; // Add up to 20 points (0-1 scale)
    factors++;
  }
  
  if (typeof leadData.authority === 'number') {
    totalScore += leadData.authority * 15; // Add up to 15 points (0-1 scale)
    factors++;
  }
  
  if (typeof leadData.need === 'number') {
    totalScore += leadData.need * 25; // Add up to 25 points (0-1 scale) 
    factors++;
  }
  
  if (typeof leadData.timeframe === 'number') {
    totalScore += leadData.timeframe * 15; // Add up to 15 points (0-1 scale)
    factors++;
  }
  
  // Check for engagement metrics
  if (typeof leadData.engagement_level === 'number') {
    totalScore += leadData.engagement_level * 10; // Add up to 10 points (0-1 scale)
    factors++;
  }
  
  if (typeof leadData.website_visits === 'number') {
    // Score based on visit count: 0-2 visits (0 pts), 3-5 visits (5 pts), 6+ visits (10 pts)
    const visits = leadData.website_visits;
    if (visits >= 3 && visits <= 5) totalScore += 5;
    else if (visits > 5) totalScore += 10;
    factors++;
  }
  
  if (typeof leadData.time_spent === 'number') {
    // Score based on time spent: <5 min (0 pts), 5-10 min (5 pts), 10+ min (10 pts)
    const timeSpent = leadData.time_spent;
    if (timeSpent >= 5 && timeSpent <= 10) totalScore += 5;
    else if (timeSpent > 10) totalScore += 10;
    factors++;
  }
  
  // Normalize score if we have factors
  if (factors > 0) {
    // Ensure score is between 0-100
    totalScore = Math.max(0, Math.min(100, totalScore));
  }
  
  // Calculate probability (0-1 scale)
  const probability = totalScore / 100;
  
  // Determine status
  let status = 'warm'; // Default
  if (totalScore >= 75) status = 'hot';
  else if (totalScore <= 40) status = 'cold';
  
  return {
    score: Math.round(totalScore),
    probability,
    status,
    dataset_type: 'lead_scoring',
    error: errorMessage
  };
}

export function getLocalBankScore(leadData: LeadData): {
  score: number;
  probability: number;
  status: string;
  dataset_type: string;
  error?: string;
} {
  // For bank dataset, we'll use a simpler approach based on economic indicators
  let totalScore = 50; // Start with neutral score
  let factors = 0;
  
  // Create the error message
  const errorMessage = "Using local fallback scoring as backend model is unavailable.";
  
  // Check if this is a person who currently has loans
  if (leadData.loan === 'yes') {
    totalScore -= 10; // Less likely to get another loan
    factors++;
  }
  
  // Check education level (higher education = higher score)
  if (leadData.education) {
    if (leadData.education.includes('university') || 
        leadData.education === 'tertiary') {
      totalScore += 10;
    } else if (leadData.education.includes('high')) {
      totalScore += 5;
    }
    factors++;
  }
  
  // Age is a factor (25-45 is prime banking age)
  if (typeof leadData.age === 'number') {
    const age = leadData.age;
    if (age >= 25 && age <= 45) totalScore += 10;
    else if (age > 45 && age <= 60) totalScore += 5;
    factors++;
  }
  
  // Previous contact matters
  if (leadData.previous && leadData.previous > 0) {
    totalScore += 10; // Engaged before
    factors++;
  }
  
  // Job type matters
  if (leadData.job) {
    const highValueJobs = ['management', 'entrepreneur', 'self-employed', 'admin.', 'technician'];
    if (highValueJobs.includes(leadData.job)) {
      totalScore += 10;
    }
    factors++;
  }
  
  // Normalize score
  if (factors > 0) {
    // Ensure score is between 0-100
    totalScore = Math.max(0, Math.min(100, totalScore));
  }
  
  // Calculate probability (0-1 scale)
  const probability = totalScore / 100;
  
  // Determine status
  let status = 'warm'; // Default
  if (totalScore >= 75) status = 'hot';
  else if (totalScore <= 40) status = 'cold';
  
  return {
    score: Math.round(totalScore),
    probability,
    status,
    dataset_type: 'bank',
    error: errorMessage
  };
} 