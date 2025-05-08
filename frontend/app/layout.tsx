import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadGenius AI',
  description: 'Lead scoring using transformer-based tabular data analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-primary-600">LeadGenius AI</Link>
              <nav className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/leads" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Leads
                </Link>
                <Link href="/leads/new" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Score Lead
                </Link>
                <Link href="/training" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Train Model
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
            LeadGenius AI — Lead scoring powered by TabNet transformer architecture
          </div>
        </footer>
      </body>
    </html>
  );
} 