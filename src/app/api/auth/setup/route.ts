import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '../../../../../models/User';

// ONE-TIME SETUP ENDPOINT - Remove after creating first admin
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check if any admin users already exist
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin user already exists. Setup not allowed.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create first admin user
    const adminUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed by the pre-save hook
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });

    return NextResponse.json({
      success: true,
      message: 'First admin user created successfully',
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}