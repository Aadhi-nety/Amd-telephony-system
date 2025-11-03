
"use client";
import { useState } from "react";
import { Phone, Volume2, X, Play } from "lucide-react";

const AMD_STRATEGIES = [
  { id: "twilio", name: "Twilio Native AMD", description: "Built-in Twilio answering machine detection" },
  { id: "jambonz", name: "Jambonz Enhanced", description: "SIP-based AMD with custom tuning" },
  { id: "huggingface", name: "Hugging Face Model", description: "AI-powered voice classification" },
  { id: "gemini", name: "Gemini Flash", description: "Google Gemini real-time audio analysis" },
];

const TEST_NUMBERS = [
  { name: "Costco Voicemail", number: "+18007742678", type: "machine" },
  { name: "Nike Voicemail", number: "+18008066453", type: "machine" },
  { name: "PayPal Voicemail", number: "+18882211161", type: "machine" },
];

export function DialInterface() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("twilio");
  const [isDialing, setIsDialing] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  const handleDial = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a phone number");
      return;
    }

    setIsDialing(true);
    setCallStatus("Initiating call...");

    try {
      const response = await fetch("/api/dial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          strategy: selectedStrategy,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCallStatus(`Call initiated with ${AMD_STRATEGIES.find(s => s.id === selectedStrategy)?.name}`);
        
        setTimeout(() => setCallStatus("Detecting answering machine..."), 2000);
        setTimeout(() => setCallStatus("Analysis in progress..."), 4000);
        
        setTimeout(() => {
          setIsDialing(false);
          setCallStatus("Call completed");
          setTimeout(() => setCallStatus(""), 3000);
        }, 6000);
      } else {
        setCallStatus(`Error: ${data.error}`);
        setTimeout(() => {
          setIsDialing(false);
          setCallStatus("");
        }, 3000);
      }
    } catch (error) {
      console.error("Dial error:", error);
      setCallStatus("Failed to initiate call");
      setTimeout(() => {
        setIsDialing(false);
        setCallStatus("");
      }, 3000);
    }
  };

  const handleTestNumber = (number: string) => {
    setPhoneNumber(number);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return `+${cleaned}`;
    if (cleaned.length <= 6) return `+${cleaned.slice(0,3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 10) return `+${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
    return `+${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,10)} ${cleaned.slice(10,14)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Make a Call</h2>
          <p className="text-gray-600 text-sm">Initiate outbound call with AMD</p>
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            placeholder="+1 800 774 2678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isDialing}
          />
          <button
            onClick={() => setPhoneNumber("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AMD Strategy
        </label>
        <select
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isDialing}
        >
          {AMD_STRATEGIES.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Test Numbers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Quick Test Numbers
          </label>
          <Volume2 className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-2">
          {TEST_NUMBERS.map((test) => (
            <button
              key={test.number}
              onClick={() => handleTestNumber(test.number)}
              disabled={isDialing}
              className="w-full text-left p-3 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-800">
                  {test.name}
                </span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  voicemail
                </span>
              </div>
              <div className="text-xs font-mono text-orange-600 mt-1">
                {test.number}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dial Button & Status */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {callStatus && (
            <div className={`text-sm font-medium ${
              callStatus.includes("Error") || callStatus.includes("Failed")
                ? "text-red-600"
                : callStatus.includes("completed")
                ? "text-green-600"
                : "text-blue-600"
            }`}>
              {callStatus}
            </div>
          )}
        </div>
        <button
          onClick={handleDial}
          disabled={isDialing || !phoneNumber.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
        >
          {isDialing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Dialing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Dial Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
