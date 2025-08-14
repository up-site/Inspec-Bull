import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/../../models/Service';
import { authenticateToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const services = await Service.find({}).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const data = await request.json();
    console.log('Received service data:', data);
    
    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    console.log('Creating service with data:', data);
    const service = new Service(data);
    console.log('Service model created, saving...');
    await service.save();
    console.log('Service saved successfully:', service);
    
    return NextResponse.json({
      success: true,
      data: service
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Service with this slug already exists' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to create service: ${error.message}` },
      { status: 500 }
    );
  }
}