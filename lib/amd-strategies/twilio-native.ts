// lib/amd-strategies/twilio-native.ts
import twilio from 'twilio';
import { CallInitiationResult } from './types';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioNativeAMD {
  async initiateCall(phoneNumber: string, callId: string): Promise<CallInitiationResult> {
    try {
      const call = await client.calls.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER!,
        url: `${process.env.NEXTAUTH_URL}/api/twilio/voice?callId=${callId}`,
        machineDetection: 'Enable', // Remove asyncAMD - it's not a valid option
        machineDetectionTimeout: 30,
        statusCallback: `${process.env.NEXTAUTH_URL}/api/twilio/events`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        timeout: 60
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status
      };
    } catch (error: any) {
      console.error('Twilio call initiation error:', error);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

  async handleAMDResult(callSid: string, amdStatus: string) {
    console.log(`AMD Result for ${callSid}: ${amdStatus}`);
    
    let amdResult: 'human' | 'machine' | 'uncertain' = 'uncertain';
    let confidence = 0.5;

    switch (amdStatus) {
      case 'human':
        amdResult = 'human';
        confidence = 0.9;
        break;
      case 'machine_start':
      case 'machine_end_beep':
        amdResult = 'machine';
        confidence = 0.85;
        break;
      default:
        amdResult = 'uncertain';
        confidence = 0.5;
    }

    return { amdResult, confidence };
  }
}