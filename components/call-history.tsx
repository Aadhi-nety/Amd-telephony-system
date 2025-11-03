
"use client";
import { useState, useEffect } from "react";
import { History, User, Voicemail, AlertCircle } from "lucide-react";

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

interface CallHistoryProps {
  limit?: number;
}

export function CallHistory({ limit = 5 }: CallHistoryProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
  }, [limit]);

  const fetchCalls = async () => {
    try {
      // For now, use mock data
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
          strategy: "audio-features",
          status: "completed",
          amdResult: "human",
          confidence: 0.78,
          duration: 32,
          startedAt: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "3",
          phoneNumber: "+18882211161",
          strategy: "twilio",
          status: "completed",
          amdResult: "machine",
          confidence: 0.92,
          duration: 28,
          startedAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: "4",
          phoneNumber: "+15551234567",
          strategy: "gemini",
          status: "completed",
          amdResult: "human",
          confidence: 0.81,
          duration: 67,
          startedAt: new Date(Date.now() - 900000).toISOString(),
        },
        {
          id: "5",
          phoneNumber: "+18007742678",
          strategy: "jambonz",
          status: "failed",
          startedAt: new Date(Date.now() - 1200000).toISOString(),
        }
      ]);
    } catch (error) {
      console.error("Error fetching calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAMDResultIcon = (result?: string) => {
    switch (result) {
      case "human": return <User className="w-3 h-3 text-green-500" />;
      case "machine": return <Voicemail className="w-3 h-3 text-red-500" />;
      case "uncertain": return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default: return <AlertCircle className="w-3 h-3 text-gray-400" />;
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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center mb-4">
        <History className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {calls.slice(0, limit).map((call) => (
          <div key={call.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="font-mono text-sm text-gray-900">{call.phoneNumber}</div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                {call.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                {getAMDResultIcon(call.amdResult)}
                <span className="capitalize">{call.amdResult || "Unknown"}</span>
                {call.confidence && (
                  <span>({Math.round(call.confidence * 100)}%)</span>
                )}
              </div>
              
              <div className="text-right">
                <div className="capitalize">{call.strategy}</div>
                {call.duration && (
                  <div>{call.duration}s</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {calls.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <History className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No calls yet</p>
        </div>
      )}

      {/* View All Link */}
      {calls.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <a 
            href="/calls" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
          >
            View all call history
          </a>
        </div>
      )}
    </div>
  );
}

