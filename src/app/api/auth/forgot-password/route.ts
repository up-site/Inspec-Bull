// src/app/api/auth/forgot-password/route.ts
import { NextRequest } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import { createResponse, createErrorResponse } from '../../../../lib/api';
import { forgotPasswordSchema } from '../../../../lib/validation';
import { generateRandomString } from '../../../../lib/utils';
// import { sendEmail, getPasswordResetEmailTemplate } from '../../../../lib/email';
import env from '../../../../config/env';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);
    
    const user = await User.findOne({ email: validatedData.email });
    
    if (!user) {
      // Don't reveal if email exists
      return createResponse(
        null,
        'If the email exists, a password reset link has been sent'
      );
    }
    
    // Generate reset token
    const resetToken = generateRandomString();
    const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();
    
    // Send reset email
    const resetLink = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Reset Your Inspec-Bull Password',
    //   html: getPasswordResetEmailTemplate(user.name, resetLink),
    // });
    
    return createResponse(
      null,
      'If the email exists, a password reset link has been sent'
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    
    return createErrorResponse('Failed to process request', 500);
  }
}