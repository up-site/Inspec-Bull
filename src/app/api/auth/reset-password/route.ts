import { NextRequest } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import { createResponse, createErrorResponse } from '../../../../lib/api';
import { resetPasswordSchema } from '../../../../lib/validation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);
    
    const user = await User.findOne({
      resetPasswordToken: validatedData.token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      return createErrorResponse('Invalid or expired reset token', 400);
    }
    
    // Update password
    user.password = validatedData.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    return createResponse(null, 'Password reset successful');
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    
    return createErrorResponse('Password reset failed', 500);
  }
}