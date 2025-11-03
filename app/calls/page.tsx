// app/calls/page.tsx
"use client";
import { useState, useEffect } from "react";
import { History, Download, User, Voicemail, AlertCircle } from "lucide-react";

interface Call {
  id: string;
  phoneNumber: string;
  strategy: string;
  status: string;
  amdResult?: string;
  confidence?: number;
  duration?: number;
  startedAt: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setCalls([
        {
          id: "1",
          phoneNumber: "+18007742678",
          strategy: "huggingface",
          status: "completed",
          amdResult: "machine",
          confidence: 0.85,
          duration: 45,
          startedAt: new Date().toISOString(),
        },
        {
          id: "2", 
          phoneNumber: "+18008066453",
          strategy: "twilio",
          status: "completed",
          amdResult: "human",
          confidence: 0.78,
          duration: 32,
          startedAt: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "3",
          phoneNumber: "+18882211161",
          strategy: "gemini",
          status: "completed",
          amdResult: "machine",
          confidence: 0.92,
          duration: 28,
          startedAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: "4",
          phoneNumber: "+15551234567",
          strategy: "jambonz",
          status: "failed",
          amdResult: "uncertain",
          confidence: 0.45,
          startedAt: new Date(Date.now() - 900000).toISOString(),
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getAMDResultIcon = (result?: string) => {
    switch (result) {
      case "human": return <User className="w-4 h-4 text-green-500" />;
      case "machine": return <Voicemail className="w-4 h-4 text-red-500" />;
      case "uncertain": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
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
                        <span className="capitalize">{call.amdResult || "Pending"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {call.confidence ? (
                        <span className="text-sm text-gray-600">
                          {Math.round(call.confidence * 100)}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {call.duration ? `${call.duration}s` : "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(call.startedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {calls.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No calls found</p>
              <p className="text-sm">Make your first call to see history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
