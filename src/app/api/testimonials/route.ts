import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial from '../../../../models/Testimonial';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check if request is from admin (has auth token)
    let isAdmin = false;
    try {
      await requireAuth(request);
      isAdmin = true;
    } catch {
      // Not authenticated, show only active testimonials
    }
    
    // For admin, show all testimonials; for public, show only active ones
    const filter = isAdmin ? {} : { isActive: true };
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Testimonials GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating testimonials
    await requireAuth(request);
    
    await connectToDatabase();
    const body = await request.json();
    
    const { clientName, position, company, testimonialText, profileImage, rating = 5, order = 0, isActive = true } = body;
    
    if (!clientName || !position || !testimonialText) {
      return NextResponse.json(
        { success: false, message: 'Client name, position, and testimonial text are required' },
        { status: 400 }
      );
    }
    
    const testimonial = new Testimonial({
      clientName,
      position,
      company,
      testimonialText,
      profileImage,
      rating,
      order,
      isActive
    });
    
    await testimonial.save();
    
    return NextResponse.json({ 
      success: true, 
      data: testimonial,
      message: 'Testimonial created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Testimonials POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}