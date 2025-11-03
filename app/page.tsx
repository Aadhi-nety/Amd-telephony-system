'use client';
import { DialInterface } from '@/components/dial-interface';
import { CallHistory } from '@/components/call-history';

export default function Home() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced AMD Telephony System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intelligent answering machine detection with multiple AI strategies. 
            Connect to humans, avoid voicemails, and optimize your outbound calls.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DialInterface />
          </div>
          <div className="lg:col-span-1">
            <CallHistory limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}