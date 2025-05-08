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
  } | null>(null);
  
  const [comparisonResult, setComparisonResult] = useState<{
    bank_model: any;
    lead_scoring_model: any;
  } | null>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  
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
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
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
      
      // Update state with response
      setScoringResult({
        score: result.score,
        probability: result.probability,
        status: result.status,
        dataset_type: datasetType
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
    
    // In a real app, this would save to backend, but for this demo we'll just navigate
    router.push('/leads');
  };
  
  // Update download PDF functionality
  const handleDownloadPDF = async () => {
    if (!scoringResult) return;
    
    setIsDownloading(true);
    
    try {
      // Call our PDF generation API endpoint
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
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }
      
      // Get the PDF blob
      const pdfBlob = await response.blob();
      
      // Create object URL for download
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create download link
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = pdfUrl;
      a.download = 'LeadGenius_Score_Report.pdf';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(pdfUrl);
        setIsDownloading(false);
      }, 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setErrors({
        form: 'Error generating PDF. Please try again.'
      });
      setIsDownloading(false);
    }
  };
  
  // Add compare models function
  const compareModels = async () => {
    try {
      // Use POST instead of GET since we're sending data
      const response = await fetch('/api/ml-scoring/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      setComparisonResult(result);
      
    } catch (error) {
      console.error('Error comparing models:', error);
      setErrors({
        form: 'Error comparing models. Please try again.'
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <Link href="/leads" className="text-primary-600 hover:text-primary-900 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold text-secondary-900">LeadGenius AI Lead Scoring</h1>
          </div>
          <p className="text-secondary-500 mt-1">Score new leads using our advanced machine learning model</p>
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
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      datasetType === 'bank' 
                        ? 'bg-primary-100 text-primary-800 border border-primary-300' 
                        : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
                    }`}
                    onClick={() => handleDatasetTypeChange('bank')}
                  >
                    Bank Marketing Dataset
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      datasetType === 'lead_scoring' 
                        ? 'bg-primary-100 text-primary-800 border border-primary-300' 
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
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Scoring...
                    </div>
                  ) : 'Score Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Result Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Scoring Result</h2>
            
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
                      <h4 className="font-semibold text-secondary-800 mb-2">Recommendation</h4>
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
                
                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="btn-outline flex items-center"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-600 mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleSaveAndView}
                    className="btn-primary"
                  >
                    Save Lead
                  </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-64 text-secondary-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 text-secondary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <p>Fill out the form and click "Score Lead" to get an AI-powered lead score</p>
              </div>
            )}
            </div>
          </div>
          
          <div className="card p-4 mt-4">
            <h3 className="text-sm font-medium text-secondary-900 mb-2">About AI Lead Scoring</h3>
            <p className="text-xs text-secondary-600">
              Our machine learning model analyzes 20+ factors to predict lead conversion probability.
              The model is trained on historical data and continuously improves with new information.
            </p>
          </div>
        </div>
      </div>
      
      {/* Add the comparison results section */}
      {comparisonResult && (
        <div className="card p-4 mt-4">
          <h3 className="text-sm font-medium text-secondary-900 mb-2">Model Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="text-xs font-semibold">Bank Model</h4>
              <div className="text-xl font-bold mt-1">
                {comparisonResult.bank_model.score}
              </div>
              <div className="text-xs">
                Status: {comparisonResult.bank_model.status}
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="text-xs font-semibold">Lead Scoring Model</h4>
              <div className="text-xl font-bold mt-1">
                {comparisonResult.lead_scoring_model.score}
              </div>
              <div className="text-xs">
                Status: {comparisonResult.lead_scoring_model.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 