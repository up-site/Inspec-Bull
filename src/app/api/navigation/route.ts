import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Navigation from '../../../../models/Navigation';
import { requireAdmin } from '@/lib/auth';

// GET /api/navigation - Get navigation items
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const parentOnly = searchParams.get('parent') === 'true';
    
    let query: any = {};
    
    if (activeOnly) {
      query.isActive = true;
    }
    
    if (parentOnly) {
      query.parentId = null;
    }
    
    let navigation = await Navigation.find(query)
      .populate('children')
      .sort({ order: 1, createdAt: 1 });
    
    // If no navigation exists, create default navigation
    if (navigation.length === 0) {
      const defaultNavigation = [
        { label: 'Home', href: '/', order: 1, isActive: true },
        { label: 'About Us', href: '/about', order: 2, isActive: true },
        { label: 'Services', href: '/services', order: 3, isActive: true, hasDropdown: true },
        { label: 'Blogs', href: '/blog', order: 4, isActive: true },
        { label: 'Contact Us', href: '/contact', order: 5, isActive: true }
      ];
      
      navigation = await Navigation.insertMany(defaultNavigation);
    }
    
    return NextResponse.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// POST /api/navigation - Create new navigation item (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    await connectToDatabase();
    
    const body = await request.json();
    const {
      label,
      href,
      order = 0,
      isActive = true,
      hasDropdown = false,
      parentId,
      target = '_self',
      icon,
      description
    } = body;

    // Validate required fields
    if (!label || !href) {
      return NextResponse.json(
        { success: false, error: 'Label and href are required' },
        { status: 400 }
      );
    }

    const navigation = await Navigation.create({
      label,
      href,
      order,
      isActive,
      hasDropdown,
      parentId,
      target,
      icon,
      description
    });

    // If this is a child item, update parent's children array
    if (parentId) {
      await Navigation.findByIdAndUpdate(
        parentId,
        { $push: { children: navigation._id }, hasDropdown: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: navigation
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create navigation item' },
      { status: 500 }
    );
  }
}