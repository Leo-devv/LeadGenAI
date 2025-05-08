import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LeadGenius AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Score and qualify leads using advanced machine learning with transformer architecture for tabular data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3 text-primary-600">Transformer-Based Lead Scoring</h2>
          <p className="text-gray-600 mb-4">
            Our TabNet transformer model analyzes lead data to predict conversion likelihood with high accuracy.
          </p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Feature selection via sequential attention
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Interpretable decision-making process
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Advanced categorical variable handling
            </li>
          </ul>
          <Link href="/leads" className="btn btn-primary inline-block">
            View Lead Dashboard
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3 text-primary-600">Model Comparison</h2>
          <p className="text-gray-600 mb-4">
            Compare performance between our transformer model and traditional machine learning approaches.
          </p>
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Side-by-side accuracy comparison
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Feature importance visualization
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Multiple dataset support
            </li>
          </ul>
          <Link href="/leads/new" className="btn btn-primary inline-block">
            Score New Lead
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary-600">About the Technology</h2>
        <p className="text-gray-700 mb-4">
          LeadGenius AI uses TabNet, a cutting-edge transformer architecture specifically designed for tabular data. 
          Unlike traditional transformers used in NLP, TabNet employs sequential attention mechanisms to select 
          which features to reason from at each decision step, making it ideal for structured data like lead information.
        </p>
        <p className="text-gray-700">
          The model works entirely locally, with no dependency on external APIs, and can be evaluated against
          traditional machine learning approaches to demonstrate its superior performance on complex lead scoring tasks.
        </p>
      </div>
    </div>
  );
} 