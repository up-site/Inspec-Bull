import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ImageConfig from '@/../../models/ImageConfig';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const imageConfig = await ImageConfig.findById(params.id);
    
    if (!imageConfig) {
      return NextResponse.json(
        { success: false, message: 'Image configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: imageConfig });
  } catch (error) {
    console.error('ImageConfig GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch image configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const imageConfig = await ImageConfig.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!imageConfig) {
      return NextResponse.json(
        { success: false, message: 'Image configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image configuration deleted successfully' 
    });
  } catch (error) {
    console.error('ImageConfig DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image configuration' },
      { status: 500 }
    );
  }
}

// Get configuration by category
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { category } = await request.json();
    
    if (category) {
      const imageConfig = await ImageConfig.findOne({ category, isActive: true });
      
      if (!imageConfig) {
        return NextResponse.json(
          { success: false, message: 'Image configuration not found for this category' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: imageConfig });
    }
    
    return NextResponse.json(
      { success: false, message: 'Category is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('ImageConfig POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch image configuration' },
      { status: 500 }
    );
  }
}