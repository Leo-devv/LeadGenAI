'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <section className="w-full">
        <div className="container mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row gap-10">
          {/* Left Side - Text */}
          <div className="w-full md:w-1/2 space-y-8 md:pl-6 lg:pl-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Enterprise Lead<br />
              <span className="text-indigo-400">Intelligence Platform</span>
            </h1>
            
            <p className="text-slate-300 text-lg max-w-md">
              Data-driven AI lead scoring system that optimizes your sales funnel and maximizes conversion potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link 
                href="/leads/new" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md inline-flex items-center justify-center"
              >
                <span>Score Lead</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a 
                href="#features" 
                className="border border-slate-600 hover:border-indigo-500 text-white px-6 py-3 rounded-md inline-flex items-center justify-center"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-10 border-t border-slate-800 pt-8">
              <div>
                <div className="text-3xl font-semibold text-white">83.98%</div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">40</div>
                <div className="text-sm text-slate-400">Epochs</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">7.4K</div>
                <div className="text-sm text-slate-400">Samples</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">34</div>
                <div className="text-sm text-slate-400">Features</div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Visual */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end pl-0 md:pl-10">
            <div className="w-full max-w-lg bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
              {/* Dashboard Header */}
              <div className="h-10 bg-slate-800 flex items-center px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-slate-400 text-xs ml-2">Lead Intelligence Dashboard</span>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6">
                <div className="h-4 w-32 bg-slate-700 rounded mb-8"></div>
                
                <div className="h-40 bg-slate-800/80 rounded-lg mb-6 p-4 flex items-end justify-between">
                  <div className="flex-1 h-[30%] bg-indigo-500/30 rounded"></div>
                  <div className="flex-1 h-[45%] bg-indigo-500/40 rounded mx-1"></div>
                  <div className="flex-1 h-[60%] bg-indigo-500/50 rounded mx-1"></div>
                  <div className="flex-1 h-[75%] bg-indigo-500/60 rounded mx-1"></div>
                  <div className="flex-1 h-[95%] bg-indigo-500/80 rounded"></div>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <div className="w-1/2 h-24 bg-slate-800/80 rounded-lg p-3">
                    <div className="h-3 w-12 bg-slate-700 rounded mb-2"></div>
                    <div className="flex items-center justify-center h-12">
                      <span className="text-2xl font-medium text-indigo-400">83.98%</span>
                    </div>
                  </div>
                  <div className="w-1/2 h-24 bg-slate-800/80 rounded-lg p-3">
                    <div className="h-3 w-12 bg-slate-700 rounded mb-2"></div>
                    <div className="flex items-center justify-center h-12">
                      <span className="text-2xl font-medium text-indigo-400">TabNet</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-slate-700 rounded-full mb-2"></div>
                <div className="h-3 w-2/3 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-white w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-5 border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Data Analysis</h3>
              <p className="text-slate-600 text-sm">
                Process tabular and time-series data with neural attention for precise scoring accuracy.
              </p>
            </div>
            
            <div className="p-5 border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Lead Classification</h3>
              <p className="text-slate-600 text-sm">
                Multi-dimensional algorithms trained on diverse industry datasets for accurate predictions.
              </p>
            </div>
            
            <div className="p-5 border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Secure Processing</h3>
              <p className="text-slate-600 text-sm">
                Process all data locally with no redirects to external dashboards for complete data privacy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
