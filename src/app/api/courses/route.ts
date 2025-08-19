import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/../../models/Course';
import { authenticateToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const courses = await Course.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await authenticateToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    
    const {
      title,
      description,
      shortDescription,
      category,
      level,
      price,
      originalPrice,
      duration,
      thumbnail,
      previewVideo,
      requirements,
      learningOutcomes,
      targetAudience,
      tags,
      status = 'draft',
      isPopular = false,
      isFeatured = false
    } = body;
    
    if (!title || !description || !shortDescription || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, short description, and category are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return NextResponse.json(
        { success: false, error: 'A course with this title already exists' },
        { status: 400 }
      );
    }
    
    const course = new Course({
      title,
      slug,
      description,
      shortDescription,
      category,
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      status,
      isPopular,
      isFeatured,
      // Keep optional fields for future online courses
      ...(level && { level }),
      ...(price !== undefined && { price }),
      ...(originalPrice && { originalPrice }),
      ...(duration && { duration }),
      ...(thumbnail && { thumbnail }),
      ...(previewVideo && { previewVideo }),
      ...(targetAudience && { targetAudience }),
      ...(tags && { tags }),
      ...(user && { instructor: user._id }),
      modules: []
    });
    
    await course.save();
    
    return NextResponse.json({ 
      success: true, 
      data: course
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}