import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    return NextResponse.json({
      hasToken: !!token,
      tokenExists: token ? 'Yes' : 'No',
      cookieNames: request.cookies.getAll().map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}