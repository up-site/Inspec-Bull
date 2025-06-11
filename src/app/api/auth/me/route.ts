import { NextRequest } from 'next/server';
import { createResponse ,createErrorResponse } from '../../../../lib/api';
import { requireAuth } from '../../../../lib/auth';
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    return createResponse(user, 'User profile retrieved successfully');
  } catch (error: any) {
    console.error('Get profile error:', error);
    return createErrorResponse('Unauthorized', 401);
  }
}