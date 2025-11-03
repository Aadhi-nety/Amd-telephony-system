
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, History } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AMD Telephony System',
  description: 'Advanced Answering Machine Detection System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AMD</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Telephony System</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <Phone className="w-4 h-4 mr-2" />
              Dialer
            </Link>
            <Link
              href="/calls"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <History className="w-4 h-4 mr-2" />
              Call History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}