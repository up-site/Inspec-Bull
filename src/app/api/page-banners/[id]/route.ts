import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageBanner from '@/../../../../models/PageBanner';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const bannerId = params.id;
    
    const banner = await PageBanner.findByIdAndUpdate(
      bannerId,
      body,
      { new: true, runValidators: true }
    );
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Page banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Page banner updated successfully'
    });
  } catch (error: any) {
    console.error('Update page banner error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update page banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);
    await connectDB();
    
    const bannerId = params.id;
    
    const banner = await PageBanner.findByIdAndDelete(bannerId);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Page banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Page banner deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete page banner error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page banner' },
      { status: 500 }
    );
  }
}