import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AboutUs from '@/../../models/AboutUs';

export async function GET() {
  try {
    await connectDB();
    const aboutUs = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!aboutUs) {
      const defaultAboutUs = new AboutUs({
        title: 'Precision, Reliability, and Excellence in Every Step!',
        description: 'INSPEC BULL INTERNATIONAL emerges as a trailblazer in the realm of Non-Destructive Testing (NDT) and quality assurance services. With an unwavering commitment to precision and reliability, we stand as the epitome of integrity and expertise in our field.',
        isActive: true
      });
      await defaultAboutUs.save();
      return NextResponse.json({ success: true, data: defaultAboutUs });
    }
    
    return NextResponse.json({ success: true, data: aboutUs });
  } catch (error) {
    console.error('AboutUs GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch about us' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { title, subtitle, description, missionStatement, visionStatement, certificationImages, companyImages } = body;
    
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    await AboutUs.updateMany({ isActive: true }, { isActive: false });
    
    const aboutUs = new AboutUs({
      title,
      subtitle,
      description,
      missionStatement,
      visionStatement,
      certificationImages: certificationImages || [],
      companyImages: companyImages || [],
      isActive: true
    });
    
    await aboutUs.save();
    
    return NextResponse.json({ 
      success: true, 
      data: aboutUs,
      message: 'About Us created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('AboutUs POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create about us' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { _id, title, subtitle, description, missionStatement, visionStatement, certificationImages, companyImages } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'About Us ID is required' },
        { status: 400 }
      );
    }
    
    const aboutUs = await AboutUs.findByIdAndUpdate(
      _id,
      { title, subtitle, description, missionStatement, visionStatement, certificationImages, companyImages },
      { new: true, runValidators: true }
    );
    
    if (!aboutUs) {
      return NextResponse.json(
        { success: false, message: 'About Us not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: aboutUs,
      message: 'About Us updated successfully' 
    });
  } catch (error) {
    console.error('AboutUs PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update about us' },
      { status: 500 }
    );
  }
}