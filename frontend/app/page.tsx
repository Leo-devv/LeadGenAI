import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LeadGenius AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Score and qualify leads using advanced machine learning with transformer architecture for tabular data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="card p-6 flex flex-col h-full">
          <div className="flex-grow">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-primary-600">Lead Dashboard</h2>
            <p className="text-gray-600 mb-4">
              View your scored leads and analyze performance metrics across different models.
            </p>
          </div>
          <Link href="/leads" className="btn btn-primary text-center">
            View Dashboard
          </Link>
        </div>

        <div className="card p-6 flex flex-col h-full">
          <div className="flex-grow">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-primary-600">Score New Lead</h2>
            <p className="text-gray-600 mb-4">
              Enter lead information and get instant scoring from our TabNet transformer model.
            </p>
          </div>
          <Link href="/leads/new" className="btn btn-primary text-center">
            Score Lead
          </Link>
        </div>

        <div className="card p-6 flex flex-col h-full">
          <div className="flex-grow">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-primary-600">Train Model</h2>
            <p className="text-gray-600 mb-4">
              Train and compare our TabNet transformer model with traditional approaches.
            </p>
          </div>
          <Link href="/training" className="btn btn-primary text-center">
            Train Model
          </Link>
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 md:pr-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">TabNet Transformer Architecture</h2>
            <p className="text-gray-700 mb-4">
              LeadGenius AI uses TabNet, a cutting-edge transformer architecture specifically designed for tabular data. 
              Unlike traditional transformers used in NLP, TabNet employs sequential attention mechanisms to select 
              which features to reason from at each decision step, making it ideal for structured data like lead information.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Feature selection via attention</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Interpretable decision process</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Superior categorical handling</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Local model execution</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-0 bg-indigo-500 rounded-lg transform rotate-3 opacity-10"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">87.2%</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Accuracy</div>
                  <div className="mt-4 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-indigo-500 rounded-full" style={{ width: '87.2%' }}></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">83.5%</div>
                    <div className="text-xs text-gray-500">Precision</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">79.8%</div>
                    <div className="text-xs text-gray-500">Recall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 