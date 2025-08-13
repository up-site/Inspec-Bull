import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FAQ from '@/../../models/FAQ';

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { question, answer, category = 'General', order = 0 } = body;
    
    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: 'Question and answer are required' },
        { status: 400 }
      );
    }
    
    const faq = new FAQ({
      question,
      answer,
      category,
      order,
      isActive: true
    });
    
    await faq.save();
    
    return NextResponse.json({ 
      success: true, 
      data: faq,
      message: 'FAQ created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('FAQ POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}