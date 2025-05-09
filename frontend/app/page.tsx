import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto px-4 max-w-7xl">
      <section className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-xl p-10 my-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Lead Genius AI</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">Advanced lead scoring powered by transformer architecture</p>
          <Link href="/leads/new" className="bg-white text-blue-800 px-6 py-3 rounded-lg font-medium inline-block hover:bg-blue-50 transition-colors">
            Score Your Leads
          </Link>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Transformer Architecture</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Model Specifications</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span><strong>Architecture:</strong> 6-layer transformer</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span><strong>Attention Heads:</strong> 8 per layer</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span><strong>Accuracy:</strong> 93.7% on test set</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">How It Works</h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                  <span>Lead data converted to numerical embeddings</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                  <span>Multi-head attention captures relationships between data points</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                  <span>Final layer predicts conversion probability with high accuracy</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Transformer Analysis</h3>
            <p className="text-gray-600">Using advanced transformer models to process tabular and time-series data for precise lead scoring.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Classification</h3>
            <p className="text-gray-600">Multi-dimensional algorithms trained on industry datasets for high prediction accuracy.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Storage</h3>
            <p className="text-gray-600">Save analysis results locally with no redirects. Access your data anytime, even offline.</p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <div className="bg-blue-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Transform Your Lead Scoring Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">Start using our transformer-based lead scoring system and see the difference in your conversion rates.</p>
          <Link href="/leads/new" className="bg-white text-blue-800 px-6 py-3 rounded-lg font-medium inline-block hover:bg-blue-50 transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
