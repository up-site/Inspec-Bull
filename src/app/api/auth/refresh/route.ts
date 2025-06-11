import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createResponse, createErrorResponse } from '../../../../lib/api';
import { requireAuth , generateAuthToken } from '../../../../lib/auth';
 
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // Generate new token
    const token = generateAuthToken(user);
    
    // Set new cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    return createResponse(
      { 
        user,
        token 
      },
      'Token refreshed successfully'
    );
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return createErrorResponse('Unauthorized', 401);
  }
}