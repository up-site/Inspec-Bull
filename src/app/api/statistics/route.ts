import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Statistics from '@/../../models/Statistics';

export async function GET() {
  try {
    await connectDB();
    const statistics = await Statistics.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!statistics) {
      const defaultStats = new Statistics({
        projectsCount: 2000,
        graduationsCount: 500,
        certificationsCount: 10,
        countriesCount: 3,
        isActive: true
      });
      await defaultStats.save();
      return NextResponse.json({ success: true, data: defaultStats });
    }
    
    return NextResponse.json({ success: true, data: statistics });
  } catch (error) {
    console.error('Statistics GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { projectsCount, graduationsCount, certificationsCount, countriesCount } = body;
    
    if (!projectsCount || !graduationsCount || !certificationsCount || !countriesCount) {
      return NextResponse.json(
        { success: false, message: 'All count fields are required' },
        { status: 400 }
      );
    }
    
    await Statistics.updateMany({ isActive: true }, { isActive: false });
    
    const statistics = new Statistics({
      projectsCount,
      graduationsCount,
      certificationsCount,
      countriesCount,
      isActive: true
    });
    
    await statistics.save();
    
    return NextResponse.json({ 
      success: true, 
      data: statistics,
      message: 'Statistics created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Statistics POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create statistics' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { _id, projectsCount, graduationsCount, certificationsCount, countriesCount } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Statistics ID is required' },
        { status: 400 }
      );
    }
    
    const statistics = await Statistics.findByIdAndUpdate(
      _id,
      { projectsCount, graduationsCount, certificationsCount, countriesCount },
      { new: true, runValidators: true }
    );
    
    if (!statistics) {
      return NextResponse.json(
        { success: false, message: 'Statistics not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: statistics,
      message: 'Statistics updated successfully' 
    });
  } catch (error) {
    console.error('Statistics PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}