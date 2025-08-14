import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/../../models/FAQ';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const filters: any = {};
    
    // Filter by active status
    if (isActive !== null) {
      filters.isActive = isActive === 'true';
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    const faqs = await FAQ.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);
      
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
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
    const body = await request.json();
    
    const { question, answer, category = 'General', order = 0, isActive = true } = body;
    
    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      );
    }
    
    const faq = new FAQ({
      question,
      answer,
      category,
      order,
      isActive
    });
    
    await faq.save();
    
    return NextResponse.json({ 
      success: true, 
      data: faq,
      message: 'FAQ created successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('FAQ POST error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to create FAQ: ${error.message}` },
      { status: 500 }
    );
  }
}