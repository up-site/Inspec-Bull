import { NextRequest } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User, { IUser } from '../../../../../models/User';
import { createResponse, createErrorResponse } from '../../../../lib/api';
import { registerSchema } from '../../../../lib/validation';
import { generateRandomString } from '../../../../lib/utils';
// import { sendEmail, getWelcomeEmailTemplate } from '../../../../lib/email';
import env from '../../../../config/env';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser: IUser | null = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return createErrorResponse('User already exists', 409);
    }
    
    // Create verification token
    const verificationToken = generateRandomString();
    
    // Create user
    const user: IUser = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      verificationToken,
    });
    
    // Send welcome email
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Welcome to Inspec-Bull - Verify Your Email',
    //   html: getWelcomeEmailTemplate(user.name, verificationLink),
    // });
    
    return createResponse(
      { 
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    
    return createErrorResponse('Registration failed', 500);
  }
}