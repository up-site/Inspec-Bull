import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return redirect('/login?error=invalid-token');
    }
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return redirect('/login?error=invalid-token');
    }
    
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return redirect('/login?success=email-verified');
  } catch (error) {
    console.error('Email verification error:', error);
    return redirect('/login?error=verification-failed');
  }
}