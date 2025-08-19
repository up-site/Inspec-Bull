import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageBanner from '@/../../models/PageBanner';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    const filters: any = {};
    if (page) {
      filters.page = page;
      filters.isActive = true;
    }
    
    const banners = await PageBanner.find(filters).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: banners
    });
  } catch (error: any) {
    console.error('Get page banners error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    
    // Check if a banner for this page already exists
    const existingBanner = await PageBanner.findOne({ page: body.page });
    if (existingBanner) {
      return NextResponse.json(
        { success: false, error: 'A banner for this page already exists. Please update the existing banner.' },
        { status: 409 }
      );
    }
    
    const banner = await PageBanner.create(body);
    
    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Page banner created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create page banner error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create page banner' },
      { status: 500 }
    );
  }
}