// app/calls/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { History, Download, Filter, Phone, User, Voicemail, AlertCircle } from 'lucide-react';

interface Call {
  id: string;
  phoneNumber: string;
  strategy: string;
  status: string;
  amdResult?: string;
  confidence?: number;
  duration?: number;
  startedAt: string;
  endedAt?: string;
  errorMessage?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    strategy: '',
    status: '',
  });

  const limit = 10;

  useEffect(() => {
    fetchCalls();
  }, [page, filters]);

  const fetchCalls = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.strategy && { strategy: filters.strategy }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await fetch(`/api/calls?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      const data = await response.json();
      setCalls(data.calls);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Phone Number', 'Strategy', 'Status', 'AMD Result', 'Confidence', 'Duration', 'Started At', 'Ended At'];
    const csvData = calls.map(call => [
      call.phoneNumber,
      call.strategy,
      call.status,
      call.amdResult || 'N/A',
      call.confidence ? `${Math.round(call.confidence * 100)}%` : 'N/A',
      call.duration ? `${call.duration}s` : 'N/A',
      new Date(call.startedAt).toLocaleString(),
      call.endedAt ? new Date(call.endedAt).toLocaleString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calls-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getAMDResultIcon = (result?: string) => {
    switch (result) {
      case 'human': return <User className="w-4 h-4 text-green-500" />;
      case 'machine': return <Voicemail className="w-4 h-4 text-red-500" />;
      case 'uncertain': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Phone className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceWidth = (confidence?: number): string => {
    if (!confidence) return '0%';
    const width = Math.max(0, Math.min(100, confidence * 100));
    return `${width}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <History className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
                <p className="text-gray-600">View and analyze all outbound calls</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.strategy}
              onChange={(e) => setFilters(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by strategy"
            >
              <option value="">All Strategies</option>
              <option value="twilio">Twilio Native</option>
              <option value="jambonz">Jambonz</option>
              <option value="huggingface">Hugging Face</option>
              <option value="gemini">Gemini</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="initiated">Initiated</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={() => setFilters({ strategy: '', status: '' })}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone Number</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Strategy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">AMD Result</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Confidence</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{call.phoneNumber}</td>
                    <td className="py-3 px-4 capitalize">{call.strategy}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getAMDResultIcon(call.amdResult)}
                        <span className="capitalize">{call.amdResult || 'Pending'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {call.confidence ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className="bg-blue-600 h-2 rounded-full absolute top-0 left-0 transition-all duration-300"
                              style={{ width: getConfidenceWidth(call.confidence) }}
                              role="progressbar"
                              aria-valuenow={call.confidence * 100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Confidence level: ${Math.round(call.confidence * 100)}%`}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[35px]">
                            {Math.round(call.confidence * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {call.duration ? `${call.duration}s` : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(call.startedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {calls.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No calls found</p>
              <p className="text-sm">Try adjusting your filters or make your first call</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}