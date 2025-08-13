import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Navigation from '../../../../../models/Navigation';
import { requireAdmin } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/navigation/[id] - Get single navigation item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const navigation = await Navigation.findById(params.id).populate('children');
    
    if (!navigation) {
      return NextResponse.json(
        { success: false, error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation item' },
      { status: 500 }
    );
  }
}

// PUT /api/navigation/[id] - Update navigation item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      label,
      href,
      order,
      isActive,
      hasDropdown,
      parentId,
      target,
      icon,
      description
    } = body;

    const navigation = await Navigation.findByIdAndUpdate(
      params.id,
      {
        label,
        href,
        order,
        isActive,
        hasDropdown,
        parentId,
        target,
        icon,
        description
      },
      { new: true, runValidators: true }
    );

    if (!navigation) {
      return NextResponse.json(
        { success: false, error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    console.error('Error updating navigation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

// DELETE /api/navigation/[id] - Delete navigation item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const navigation = await Navigation.findById(params.id);

    if (!navigation) {
      return NextResponse.json(
        { success: false, error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // If this item has children, delete them too or update their parentId
    if (navigation.children && navigation.children.length > 0) {
      await Navigation.updateMany(
        { _id: { $in: navigation.children } },
        { $unset: { parentId: 1 } }
      );
    }

    // If this is a child item, remove it from parent's children array
    if (navigation.parentId) {
      await Navigation.findByIdAndUpdate(
        navigation.parentId,
        { $pull: { children: navigation._id } }
      );
    }

    await Navigation.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Navigation item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting navigation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}