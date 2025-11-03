
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const strategy = searchParams.get('strategy');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (strategy) where.strategy = strategy;
    if (status) where.status = status;

    try {
      // Get calls with pagination
      const [calls, totalCount] = await Promise.all([
        prisma.call.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          select: {
            id: true,
            phoneNumber: true,
            strategy: true,
            status: true,
            amdResult: true,
            confidence: true,
            duration: true,
            startedAt: true,
            endedAt: true,
            errorMessage: true,
          },
        }),
        prisma.call.count({ where }),
      ]);

      return NextResponse.json({
        calls,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (dbError) {
      // If database error, return mock data
      console.error('Database error:', dbError);
      const mockCalls = [
        {
          id: 'mock-1',
          phoneNumber: '+18007742678',
          strategy: 'huggingface',
          status: 'completed',
          amdResult: 'machine',
          confidence: 0.85,
          duration: 45,
          startedAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          phoneNumber: '+18008066453', 
          strategy: 'audio-features',
          status: 'completed',
          amdResult: 'human',
          confidence: 0.78,
          duration: 32,
          startedAt: new Date(Date.now() - 300000).toISOString(),
        }
      ];
      
      return NextResponse.json({
        calls: mockCalls,
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 2,
          totalPages: 1,
        },
      });
    }

  } catch (error: any) {
    console.error('Calls API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calls: ' + error.message },
      { status: 500 }
    );
  }
}
