import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createResponse } from '../../../../lib/api';

export async function POST(request: NextRequest) {
  try {
    // Clear token cookie
    cookies().delete('token');
    
    return createResponse(null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return createResponse(null, 'Logout successful'); // Always return success for logout
  }
}