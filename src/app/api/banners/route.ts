import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '../../../../models/Banner';
import { requireAdmin } from '@/lib/auth';

// GET /api/banners - Get all banners
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    const query = activeOnly ? { isActive: true } : {};
    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create new banner (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    await connectToDatabase();
    
    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      isActive = true,
      order = 0
    } = body;

    // Validate required fields
    if (!title || !subtitle || !description || !backgroundImage || !ctaText || !ctaLink) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      backgroundImage,
      ctaText,
      ctaLink,
      isActive,
      order
    });

    return NextResponse.json({
      success: true,
      data: banner
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}