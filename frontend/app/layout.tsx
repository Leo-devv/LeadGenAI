import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lead Genius AI',
  description: 'AI-powered lead scoring and analytics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <header className="w-full bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center rounded">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Lead Genius AI</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-white hover:text-indigo-400 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/leads/new" className="flex items-center justify-center text-white hover:text-indigo-400 text-sm font-medium transition-colors duration-200">
                Score Lead
              </Link>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-slate-400 text-sm">
              © {new Date().getFullYear()} Lead Genius AI. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 