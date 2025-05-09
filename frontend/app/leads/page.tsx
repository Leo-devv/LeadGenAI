'use client';

import Link from 'next/link';

const mockLeads = [
  {
    id: 1,
    name: 'John Doe',
    company: 'Acme Inc',
    email: 'john@acme.com',
    score: 85,
    status: 'hot',
    date: '2023-12-10',
    model: 'transformer'
  },
  {
    id: 2,
    name: 'Jane Smith',
    company: 'TechCorp',
    email: 'jane@techcorp.com',
    score: 42,
    status: 'warm',
    date: '2023-12-09',
    model: 'random_forest'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    company: 'Data Systems',
    email: 'robert@datasystems.com',
    score: 67,
    status: 'warm',
    date: '2023-12-08',
    model: 'transformer'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    company: 'Innovation Labs',
    email: 'maria@innov.com',
    score: 23,
    status: 'cold',
    date: '2023-12-07',
    model: 'random_forest'
  },
  {
    id: 5,
    name: 'David Kim',
    company: 'FinTech Solutions',
    email: 'david@fintech.com',
    score: 91,
    status: 'hot',
    date: '2023-12-06',
    model: 'transformer'
  }
];

export default function LeadsPage() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads Dashboard</h1>
          <p className="text-gray-500">Manage and view your scored leads</p>
        </div>
        <Link 
          href="/leads/new" 
          className="btn btn-primary flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          New Lead
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-gray-500 text-sm">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{lead.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">{lead.score}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${lead.status === 'hot' ? 'bg-green-100 text-green-800' : 
                        lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.model === 'transformer' ? 'Transformer' : 'Random Forest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">View</a>
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Model Comparison</h2>
          <p className="text-gray-600 mb-6">
            The performance metrics below compare our transformer model with the traditional random forest approach.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">TabNet Transformer Model</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">87.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precision</span>
                  <span className="font-medium">83.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recall</span>
                  <span className="font-medium">79.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">F1 Score</span>
                  <span className="font-medium">81.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Random Forest Model</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">82.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precision</span>
                  <span className="font-medium">78.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recall</span>
                  <span className="font-medium">75.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">F1 Score</span>
                  <span className="font-medium">77.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 