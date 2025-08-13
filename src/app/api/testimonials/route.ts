import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/../../models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
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
    await connectDB();
    const body = await request.json();
    
    const { clientName, position, company, testimonialText, profileImage, rating = 5, order = 0 } = body;
    
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
      isActive: true
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