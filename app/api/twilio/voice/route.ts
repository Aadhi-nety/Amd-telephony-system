// app/api/twilio/voice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid');
    const callStatus = formData.get('CallStatus');
    
    const url = new URL(request.url);
    const callId = url.searchParams.get('callId');

    console.log(`Twilio Voice Webhook: CallSid=${callSid}, Status=${callStatus}, CallId=${callId}`);

    const response = new VoiceResponse();

    if (callStatus === 'answered') {
      // When call is answered, we'll let Twilio's AMD handle detection
      // and wait for the status callback
      response.say({
        voice: 'alice',
        language: 'en-US'
      }, 'Hello! Thank you for answering. We are connecting you to our representative.');
      
      // You can add more TwiML instructions here
      response.pause({ length: 2 });
      
    } else {
      response.say('Thank you for your call. Goodbye.');
      response.hangup();
    }

    // Return TwiML response
    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Twilio voice webhook error:', error);
    
    // Fallback TwiML response
    const response = new VoiceResponse();
    response.say('We are experiencing technical difficulties. Please try again later.');
    response.hangup();
    
    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}