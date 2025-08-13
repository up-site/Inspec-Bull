import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Smart upload API is working',
    timestamp: new Date().toISOString()
  });
}