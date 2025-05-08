'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ModelTrainingPage() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResult, setTrainingResult] = useState<any>(null)
  const [selectedDataset, setSelectedDataset] = useState('lead_scoring')
  const [selectedModel, setSelectedModel] = useState('transformer')
  const [error, setError] = useState<string | null>(null)

  const handleTrainModel = async () => {
    setIsTraining(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ml-scoring/train?dataset_type=${selectedDataset}&model_type=${selectedModel}`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to train model')
      }
      
      const result = await response.json()
      setTrainingResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      console.error('Error training model:', err)
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Model Training Dashboard</h1>
        <p className="text-gray-500">Train and evaluate the lead scoring models</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 md:col-span-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Training Options</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dataset
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="lead_scoring">Lead Scoring Dataset</option>
              <option value="bank">Bank Marketing Dataset</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Type
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="transformer">TabNet Transformer</option>
              <option value="random_forest">Random Forest</option>
            </select>
          </div>
          
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className={`w-full btn ${isTraining ? 'bg-gray-400' : 'btn-primary'}`}
          >
            {isTraining ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Training in progress...
              </span>
            ) : (
              'Train Model'
            )}
          </button>
          
          <div className="mt-4">
            <Link href="/leads" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Leads Dashboard
            </Link>
          </div>
        </div>
        
        <div className="card p-6 md:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Training Results</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isTraining && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Training in Progress</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This may take a few moments to complete...
                </p>
              </div>
            </div>
          )}
          
          {!isTraining && trainingResult && (
            <div className="bg-white">
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Model: {selectedModel === 'transformer' ? 'TabNet Transformer' : 'Random Forest'} on {selectedDataset === 'lead_scoring' ? 'Lead Scoring' : 'Bank Marketing'} dataset
              </h3>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Accuracy</dt>
                      <dd className="mt-1 text-2xl font-semibold text-indigo-600">
                        {(trainingResult.accuracy * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Precision</dt>
                      <dd className="mt-1 text-2xl font-semibold text-indigo-600">
                        {(trainingResult.precision * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Recall</dt>
                      <dd className="mt-1 text-2xl font-semibold text-indigo-600">
                        {(trainingResult.recall * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">F1 Score</dt>
                      <dd className="mt-1 text-2xl font-semibold text-indigo-600">
                        {(trainingResult.f1 * 100).toFixed(1)}%
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        Model Performance
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {(trainingResult.roc_auc * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div style={{ width: `${trainingResult.roc_auc * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h4>
                <Link href="/leads/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Test With New Lead
                </Link>
              </div>
            </div>
          )}
          
          {!isTraining && !trainingResult && !error && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-500 text-center max-w-xs">
                Select your dataset and model type, then click "Train Model" to start the training process.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">How Model Training Works</h2>
        <p className="text-gray-600 mb-4">
          LeadGenius AI utilizes two different machine learning approaches:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-primary-600 mb-2">TabNet Transformer</h3>
            <p className="text-sm text-gray-600">
              Our transformer architecture designed specifically for tabular data. TabNet employs sequential attention 
              mechanisms to select which features to reason from at each decision step.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-primary-600 mb-2">Random Forest</h3>
            <p className="text-sm text-gray-600">
              A traditional machine learning approach using ensemble learning. This model serves as our baseline 
              for comparison with the more advanced transformer architecture.
            </p>
          </div>
        </div>
        
        <p className="text-gray-600">
          Training calculates key metrics including accuracy, precision, recall, F1 score, and ROC AUC. These 
          metrics help evaluate model performance and ensure reliable lead scoring predictions.
        </p>
      </div>
    </div>
  )
} 