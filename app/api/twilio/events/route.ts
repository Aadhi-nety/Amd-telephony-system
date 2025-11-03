// app/api/twilio/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AMDFactory } from '@/lib/amd-strategies/factory';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const answeredBy = formData.get('AnsweredBy') as string;
    const duration = formData.get('CallDuration') as string;

    console.log(`Twilio Event: CallSid=${callSid}, Status=${callStatus}, AnsweredBy=${answeredBy}`);

    // Find the call in our database
    const call = await prisma.call.findFirst({
      where: { externalId: callSid }
    });

    if (!call) {
      console.warn(`No call found for CallSid: ${callSid}`);
      return NextResponse.json({ success: false, error: 'Call not found' }, { status: 404 });
    }

    let updateData: any = {
      status: callStatus,
    };

    // Handle AMD results
    if (answeredBy) {
      const amdResult = await AMDFactory.handleAMDResult(
        call.strategy as any,
        callSid,
        answeredBy
      );

      updateData.amdResult = amdResult.amdResult;
      updateData.confidence = amdResult.confidence;

      console.log(`AMD Result for ${callSid}: ${amdResult.amdResult} (confidence: ${amdResult.confidence})`);
    }

    // Handle call completion
    if (callStatus === 'completed') {
      updateData.endedAt = new Date();
      if (duration) {
        updateData.duration = parseInt(duration);
      }
    }

    // Update call record
    await prisma.call.update({
      where: { id: call.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Twilio events webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}