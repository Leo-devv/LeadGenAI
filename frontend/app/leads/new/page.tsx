'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Common fields for both datasets
const commonFields = [
  { name: 'name', label: 'Lead Name', type: 'text', required: true, defaultValue: 'John Doe' },
  { name: 'email', label: 'Email', type: 'email', required: false, defaultValue: 'john.doe@example.com' },
  { name: 'phone', label: 'Phone Number', type: 'text', required: false, defaultValue: '+1 555-123-4567' },
  { name: 'company', label: 'Company', type: 'text', required: false, defaultValue: 'ACME Corp' },
  { 
    name: 'source', 
    label: 'Lead Source', 
    type: 'select', 
    required: false,
    options: ['website', 'referral', 'social', 'email', 'call', 'event', 'other'],
    defaultValue: 'website'
  },
];

// Bank dataset specific fields
const bankFields = [
  { name: 'age', label: 'Age', type: 'number', required: true, defaultValue: 35 },
  { 
    name: 'job', 
    label: 'Job', 
    type: 'select', 
    required: true,
    options: ['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'],
    defaultValue: 'admin.'
  },
  { 
    name: 'marital', 
    label: 'Marital Status', 
    type: 'select', 
    required: true,
    options: ['divorced', 'married', 'single', 'unknown'],
    defaultValue: 'divorced'
  },
  { 
    name: 'education', 
    label: 'Education', 
    type: 'select', 
    required: true,
    options: ['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 'illiterate', 'professional.course', 'university.degree', 'unknown'],
    defaultValue: 'tertiary'
  },
  { 
    name: 'default', 
    label: 'Has Credit in Default', 
    type: 'select', 
    required: true,
    options: ['no', 'yes', 'unknown'],
    defaultValue: 'no'
  },
  { 
    name: 'housing', 
    label: 'Has Housing Loan', 
    type: 'select', 
    required: true,
    options: ['no', 'yes', 'unknown'],
    defaultValue: 'yes'
  },
  { 
    name: 'loan', 
    label: 'Has Personal Loan', 
    type: 'select', 
    required: true,
    options: ['no', 'yes', 'unknown'],
    defaultValue: 'no'
  },
  { 
    name: 'contact', 
    label: 'Contact Type', 
    type: 'select', 
    required: true,
    options: ['cellular', 'telephone'],
    defaultValue: 'cellular'
  },
  { 
    name: 'month', 
    label: 'Last Contact Month', 
    type: 'select', 
    required: true,
    options: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    defaultValue: 'may'
  },
  { 
    name: 'day_of_week', 
    label: 'Last Contact Day of Week', 
    type: 'select', 
    required: true,
    options: ['mon', 'tue', 'wed', 'thu', 'fri'],
    defaultValue: 'mon'
  },
  { name: 'duration', label: 'Last Contact Duration (seconds)', type: 'number', required: true, defaultValue: 180 },
  { name: 'campaign', label: 'Number of Contacts Performed', type: 'number', required: true, defaultValue: 2 },
  { name: 'pdays', label: 'Days Since Last Contact', type: 'number', required: true, defaultValue: 999 },
  { name: 'previous', label: 'Previous Contacts', type: 'number', required: true, defaultValue: 0 },
  { 
    name: 'poutcome', 
    label: 'Previous Campaign Outcome', 
    type: 'select', 
    required: true,
    options: ['failure', 'nonexistent', 'success'],
    defaultValue: 'nonexistent'
  },
  { name: 'emp_var_rate', label: 'Employment Variation Rate', type: 'number', step: '0.1', required: true, defaultValue: -1.8 },
  { name: 'cons_price_idx', label: 'Consumer Price Index', type: 'number', step: '0.01', required: true, defaultValue: 92.89 },
  { name: 'cons_conf_idx', label: 'Consumer Confidence Index', type: 'number', step: '0.1', required: true, defaultValue: -46.2 },
  { name: 'euribor3m', label: 'Euribor 3 Month Rate', type: 'number', step: '0.001', required: true, defaultValue: 1.3 },
  { name: 'nr_employed', label: 'Number of Employees', type: 'number', step: '0.1', required: true, defaultValue: 5099.1 },
];

// Lead scoring dataset specific fields (BANT framework)
const leadScoringFields = [
  { name: 'budget', label: 'Budget Score (0-1)', type: 'number', step: '0.1', required: true, defaultValue: 0.7, min: 0, max: 1 },
  { name: 'authority', label: 'Authority Score (0-1)', type: 'number', step: '0.1', required: true, defaultValue: 0.8, min: 0, max: 1 },
  { name: 'need', label: 'Need Score (0-1)', type: 'number', step: '0.1', required: true, defaultValue: 0.6, min: 0, max: 1 },
  { name: 'timeframe', label: 'Timeframe Score (0-1)', type: 'number', step: '0.1', required: true, defaultValue: 0.75, min: 0, max: 1 },
  { name: 'engagement_level', label: 'Engagement Level (0-1)', type: 'number', step: '0.1', required: true, defaultValue: 0.65, min: 0, max: 1 },
  { name: 'website_visits', label: 'Website Visits Count', type: 'number', required: true, defaultValue: 5 },
  { name: 'time_spent', label: 'Time Spent on Website (minutes)', type: 'number', step: '0.1', required: true, defaultValue: 8.5 },
  { name: 'content_downloaded', label: 'Content Downloads Count', type: 'number', required: true, defaultValue: 2 },
];

// Form validation type
type FormErrors = {
  [key: string]: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Create initial state from field definitions
    const initialState: Record<string, any> = {};
    
    // Add common fields
    commonFields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialState[field.name] = field.defaultValue;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        initialState[field.name] = field.options[0];
      } else {
        initialState[field.name] = '';
      }
    });
    
    // Add bank fields (default)
    bankFields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialState[field.name] = field.defaultValue;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        initialState[field.name] = field.options[0];
      } else {
        initialState[field.name] = '';
      }
    });
    
    return initialState;
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datasetType, setDatasetType] = useState<string>("bank");
  const [scoringResult, setScoringResult] = useState<{
    score: number;
    probability: number;
    status: string;
    dataset_type?: string;
    error?: string;
  } | null>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric values
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle dataset type change
  const handleDatasetTypeChange = (type: string) => {
    setDatasetType(type);
    
    // Update form data based on selected dataset type
    if (type === 'lead_scoring') {
      // Add lead scoring fields, preserve common field values
      const newFormData = { ...formData };
      
      leadScoringFields.forEach(field => {
        if (field.defaultValue !== undefined) {
          newFormData[field.name] = field.defaultValue;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          newFormData[field.name] = field.options[0];
        } else {
          newFormData[field.name] = '';
        }
      });
      
      setFormData(newFormData);
    } else if (type === 'bank') {
      // Add bank fields, preserve common field values
      const newFormData = { ...formData };
      
      bankFields.forEach(field => {
        if (field.defaultValue !== undefined) {
          newFormData[field.name] = field.defaultValue;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          newFormData[field.name] = field.options[0];
        } else {
          newFormData[field.name] = '';
        }
      });
      
      setFormData(newFormData);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    commonFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'number' && formData[field.name] !== '' && isNaN(Number(formData[field.name]))) {
        newErrors[field.name] = `${field.label} must be a number`;
      }
    });
    
    if (datasetType === 'bank') {
      bankFields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
        
        if (field.type === 'number' && formData[field.name] !== '' && isNaN(Number(formData[field.name]))) {
          newErrors[field.name] = `${field.label} must be a number`;
        }
      });
    } else if (datasetType === 'lead_scoring') {
      leadScoringFields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
        
        if (field.type === 'number' && formData[field.name] !== '' && isNaN(Number(formData[field.name]))) {
          newErrors[field.name] = `${field.label} must be a number`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    setScoringResult(null);
    setErrors({});
    
    try {
      // Add dataset type to request
      const requestData = {
        ...formData,
        dataset_type: datasetType,
        model_type: 'random_forest' // Default model type
      };
      
      // Send data to API for scoring
      const response = await fetch('/api/score-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if there was an error in the response
      if (result.error) {
        console.warn('Scoring warning:', result.error);
        // We still set the scoring result since the API returns a fallback score
      }
      
      // Update state with response
      setScoringResult({
        score: result.score,
        probability: result.probability,
        status: result.status,
        dataset_type: result.dataset_type || datasetType,
        error: result.error
      });
    } catch (error) {
      console.error('Error scoring lead:', error);
      setErrors({
        form: 'Failed to score lead. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveAndView = () => {
    if (!scoringResult) return;
    
    // Save to local storage instead of navigating to leads dashboard
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('leadAnalyses') || '[]');
      const analysisToSave = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        leadData: formData,
        scoringResult,
        datasetType
      };
      
      savedAnalyses.push(analysisToSave);
      localStorage.setItem('leadAnalyses', JSON.stringify(savedAnalyses));
      
      // Show success message instead of redirecting
      setSuccessMessage('Analysis saved successfully! You can access all saved analyses from your local storage.');
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error saving analysis:', error);
      setErrors({
        form: 'Failed to save analysis locally. Please try again.'
      });
    }
  };
  
  // Update download PDF functionality
  const handleDownloadPDF = async () => {
    if (!scoringResult) return;
    
    setIsDownloading(true);
    
    try {
      // Call our HTML report generation API endpoint
      const response = await fetch('/api/lead-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadData: formData,
          scoringResult
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }
      
      // For HTML report, we'll open it in a new window
      const htmlContent = await response.text();
      
      // Open the report in a new window
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
      } else {
        throw new Error('Unable to open report window. Please check your popup settings.');
      }
      
      setIsDownloading(false);
    } catch (error) {
      console.error('Error viewing report:', error);
      setErrors({
        form: 'Error generating report. Please try again.'
      });
      setIsDownloading(false);
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <Link href="/" className="text-blue-700 hover:text-blue-900 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold text-secondary-900">Lead Genius AI Analysis</h1>
          </div>
          <p className="text-secondary-500 mt-1">Score leads using our advanced machine learning model</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Lead Information</h2>
            
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Dataset Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      datasetType === 'bank' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
                    }`}
                    onClick={() => handleDatasetTypeChange('bank')}
                  >
                    Bank Marketing Dataset
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      datasetType === 'lead_scoring' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
                    }`}
                    onClick={() => handleDatasetTypeChange('lead_scoring')}
                  >
                    B2B Lead Scoring Dataset
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Lead Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {commonFields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-secondary-700 mb-1">
                      {field.label}{field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        required={field.required}
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        required={field.required}
                        step={field.step}
                        min={field.min}
                        max={field.max}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>
              
              {datasetType === 'bank' && (
                <>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Bank Marketing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {bankFields.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-secondary-700 mb-1">
                          {field.label}{field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            required={field.required}
                          >
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            required={field.required}
                            step={field.step}
                            min={field.min}
                            max={field.max}
                          />
                        )}
                        {errors[field.name] && (
                          <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {datasetType === 'lead_scoring' && (
                <>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">B2B Lead Scoring Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {leadScoringFields.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-secondary-700 mb-1">
                          {field.label}{field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            required={field.required}
                          >
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className={`block w-full border ${errors[field.name] ? 'border-red-500' : 'border-secondary-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            required={field.required}
                            step={field.step}
                            min={field.min}
                            max={field.max}
                          />
                        )}
                        {errors[field.name] && (
                          <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-md flex items-center justify-center min-w-[120px] transition-all duration-200 hover:shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Analyze Lead
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Result Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Analysis Result</h2>
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {scoringResult ? (
                <div className="text-center">
                  <div className="space-y-4">
                    <div>
                      <div className={`inline-flex items-center justify-center h-24 w-24 rounded-full mb-4 ${
                        scoringResult.status === 'hot' 
                          ? 'bg-red-100' 
                          : scoringResult.status === 'warm'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                      }`}>
                        <span className={`text-3xl font-bold ${
                          scoringResult.status === 'hot' 
                            ? 'text-red-600' 
                            : scoringResult.status === 'warm'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                  }`}>
                    {scoringResult.score}
                        </span>
                  </div>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-1">
                        {scoringResult.status === 'hot' 
                          ? 'Hot Lead' 
                          : scoringResult.status === 'warm'
                            ? 'Warm Lead'
                            : 'Cold Lead'
                        }
                      </h3>
                      <p className="text-secondary-600">
                        Conversion Probability: {(scoringResult.probability * 100).toFixed(2)}%
                      </p>
                      <p className="text-secondary-600 mt-1">
                        Using {scoringResult.dataset_type === 'bank' ? 'Bank Marketing' : 'B2B Lead Scoring'} dataset
                      </p>
                </div>
                
                {scoringResult.error && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 text-left">
                    <div className="flex">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Using fallback scoring model. The requested model was not available.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                    <div className="border-t border-b border-gray-200 py-4 my-4">
                      <h4 className="font-semibold text-secondary-800 mb-3">Lead Information</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                          <span className="text-secondary-500">Name:</span>
                          <span className="font-medium text-secondary-900 ml-2">{formData.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-secondary-500">Company:</span>
                          <span className="font-medium text-secondary-900 ml-2">{formData.company || 'N/A'}</span>
                        </div>
                        {scoringResult.dataset_type === 'bank' ? (
                          <>
                            <div>
                              <span className="text-secondary-500">Age:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.age}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Job:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.job}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Education:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.education}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Contact:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.contact}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-secondary-500">Budget:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.budget ? (formData.budget * 10).toFixed(1) + '/10' : 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Authority:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.authority ? (formData.authority * 10).toFixed(1) + '/10' : 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Need:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.need ? (formData.need * 10).toFixed(1) + '/10' : 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-secondary-500">Timeframe:</span>
                              <span className="font-medium text-secondary-900 ml-2">{formData.timeframe ? (formData.timeframe * 10).toFixed(1) + '/10' : 'N/A'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-secondary-800 mb-2">Recommended Action</h4>
                      <p className="text-secondary-600 text-sm">
                        {scoringResult.status === 'hot' 
                          ? (scoringResult.dataset_type === 'bank'
                             ? 'This lead shows high potential for conversion. Prioritize immediate follow-up with a personalized approach offering tailored banking solutions.' 
                             : 'This lead shows high potential for conversion. Schedule a demo and send a customized proposal within 24 hours.')
                          : scoringResult.status === 'warm'
                            ? (scoringResult.dataset_type === 'bank'
                               ? 'This lead shows moderate potential. Follow up within 2-3 days with additional information about banking services relevant to their profile.' 
                               : 'This lead shows moderate potential. Send case studies and nurture with targeted content addressing their specific needs.')
                            : (scoringResult.dataset_type === 'bank'
                               ? 'This lead shows lower potential for conversion. Consider nurturing via email campaigns about relevant financial products and reassess after engagement.' 
                               : 'This lead shows lower potential for conversion. Add to nurture campaign with educational content and re-evaluate in 30 days.')
                          }
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3 mt-6">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-all duration-200 min-w-[130px]"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-600 mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span>View Report</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleSaveAndView}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all duration-200 min-w-[130px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Save Analysis</span>
                  </button>
                </div>
              </div>
            </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-64 text-secondary-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 text-secondary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <p>Fill out the form and click "Analyze Lead" to get an AI-powered lead score</p>
              </div>
            )}
            </div>
          </div>
          
          <div className="card p-4 mt-4">
            <h3 className="text-sm font-medium text-secondary-900 mb-2">About AI Lead Scoring</h3>
            <p className="text-xs text-secondary-600">
              Our machine learning model analyzes 20+ factors to predict lead conversion probability.
              The model is trained on business data and provides actionable intelligence for your sales team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 