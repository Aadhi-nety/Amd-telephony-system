// lib/amd-strategies/types.ts
export type AMDStrategy = 'twilio' | 'jambonz' | 'huggingface' | 'gemini';

export interface AMDDetectionResult {
  label: 'human' | 'machine' | 'uncertain' | 'error';
  confidence: number;
  processingTime: number;
  details?: any;
}

export interface CallInitiationResult {
  success: boolean;
  callSid?: string;
  error?: string;
  status: string;
}