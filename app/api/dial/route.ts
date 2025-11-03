// app/api/dial/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const dialSchema = z.object({
  phoneNumber: z.string().regex(/^\+1\d{10}$/, 'Invalid US phone number format'),
  strategy: z.enum(['twilio', 'jambonz', 'huggingface', 'gemini']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = dialSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { phoneNumber, strategy } = validationResult.data;

    console.log(`Initiating call to ${phoneNumber} with strategy: ${strategy}`);

    // Create call record with simple user ID (no foreign key constraint)
    const call = await prisma.call.create({
      data: {
        userId: 'default-user', // Simple string, no relation needed
        phoneNumber,
        strategy,
        status: 'initiated',
      },
    });

    console.log(`Call record created: ${call.id}`);

    // Return success response
    return NextResponse.json({
      success: true,
      callId: call.id,
      callSid: 'mock-' + Date.now(),
      status: 'initiated',
      message: 'Call initiated successfully'
    });

  } catch (error: any) {
    console.error('Dial API error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call: ' + error.message },
      { status: 500 }
    );
  }
}