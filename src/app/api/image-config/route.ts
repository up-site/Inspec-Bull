import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ImageConfig from '@/../../models/ImageConfig';

// Default configurations for different image categories
const defaultConfigs = [
  {
    category: 'banner',
    label: 'Hero Banners',
    description: 'Main hero section background images for desktop',
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    mobileVersion: { width: 768, height: 1024, aspectRatio: '3:4' },
    maxFileSize: 5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'banners',
    isActive: true
  },
  {
    category: 'mobile-banner',
    label: 'Mobile Banners',
    description: 'Hero section images optimized for mobile devices',
    dimensions: { width: 768, height: 1024, aspectRatio: '3:4' },
    maxFileSize: 3,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'banners/mobile',
    isActive: true
  },
  {
    category: 'service',
    label: 'Service Images',
    description: 'Images for service cards and detail pages',
    dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
    maxFileSize: 2,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'services',
    isActive: true
  },
  {
    category: 'job',
    label: 'Job Images',
    description: 'Images for job listings and career pages',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' },
    maxFileSize: 1.5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'jobs',
    isActive: true
  },
  {
    category: 'client-logo',
    label: 'Client Logos',
    description: 'Company logos with transparent backgrounds',
    dimensions: { width: 300, height: 150, aspectRatio: '2:1' },
    maxFileSize: 1,
    allowedFormats: ['png', 'svg'],
    folder: 'clients',
    isActive: true
  },
  {
    category: 'testimonial-photo',
    label: 'Testimonial Photos',
    description: 'Client profile photos for testimonials',
    dimensions: { width: 200, height: 200, aspectRatio: '1:1' },
    maxFileSize: 1,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    folder: 'testimonials',
    isActive: true
  },
  {
    category: 'certification',
    label: 'Certification Images',
    description: 'Certification badges and awards',
    dimensions: { width: 300, height: 300, aspectRatio: '1:1' },
    maxFileSize: 1,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    folder: 'about-us/certifications',
    isActive: true
  },
  {
    category: 'company-photo',
    label: 'Company Photos',
    description: 'Office, team, and facility photos',
    dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
    maxFileSize: 3,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'about-us/company',
    isActive: true
  },
  {
    category: 'blog-featured',
    label: 'Blog Featured Images',
    description: 'Main images for blog posts',
    dimensions: { width: 1200, height: 630, aspectRatio: '1.91:1' },
    maxFileSize: 2,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'blog',
    isActive: true
  },
  {
    category: 'course-thumbnail',
    label: 'Course Thumbnails',
    description: 'Thumbnail images for courses',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' },
    maxFileSize: 1.5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'courses',
    isActive: true
  }
];

export async function GET() {
  try {
    await connectDB();
    const configs = await ImageConfig.find({ isActive: true }).sort({ category: 1 });
    
    // If no configs exist, create default ones
    if (configs.length === 0) {
      await ImageConfig.insertMany(defaultConfigs);
      const newConfigs = await ImageConfig.find({ isActive: true }).sort({ category: 1 });
      return NextResponse.json({ success: true, data: newConfigs });
    }
    
    return NextResponse.json({ success: true, data: configs });
  } catch (error) {
    console.error('ImageConfig GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch image configurations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('ImageConfig POST - Received body:', body);
    
    const {
      category,
      label,
      description,
      dimensions,
      mobileVersion,
      maxFileSize,
      allowedFormats,
      folder,
      examples
    } = body;
    
    // Validate required fields
    if (!category || !label || !dimensions || !folder) {
      console.log('ImageConfig POST - Missing required fields:', { 
        category: !!category, 
        label: !!label, 
        dimensions: !!dimensions, 
        folder: !!folder 
      });
      return NextResponse.json(
        { success: false, message: 'Category, label, dimensions, and folder are required' },
        { status: 400 }
      );
    }
    
    // Validate dimensions structure
    if (!dimensions.width || !dimensions.height || !dimensions.aspectRatio) {
      console.log('ImageConfig POST - Invalid dimensions structure:', dimensions);
      return NextResponse.json(
        { success: false, message: 'Dimensions must include width, height, and aspectRatio' },
        { status: 400 }
      );
    }
    
    // Check if category already exists
    const existingConfig = await ImageConfig.findOne({ category });
    if (existingConfig) {
      console.log('ImageConfig POST - Category already exists:', category);
      return NextResponse.json(
        { success: false, message: `Configuration for category "${category}" already exists. Please use PUT to update or choose a different category.` },
        { status: 400 }
      );
    }
    
    const imageConfig = new ImageConfig({
      category,
      label,
      description,
      dimensions,
      mobileVersion,
      maxFileSize: maxFileSize || 5,
      allowedFormats: allowedFormats || ['jpg', 'jpeg', 'png'],
      folder,
      examples: examples || [],
      isActive: true
    });
    
    console.log('ImageConfig POST - About to save:', imageConfig.toObject());
    await imageConfig.save();
    console.log('ImageConfig POST - Successfully saved');
    
    return NextResponse.json({ 
      success: true, 
      data: imageConfig,
      message: 'Image configuration created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('ImageConfig POST error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: `Duplicate category: A configuration with this category already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: `Failed to create image configuration: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Configuration ID is required' },
        { status: 400 }
      );
    }
    
    const imageConfig = await ImageConfig.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!imageConfig) {
      return NextResponse.json(
        { success: false, message: 'Image configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: imageConfig,
      message: 'Image configuration updated successfully' 
    });
  } catch (error) {
    console.error('ImageConfig PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update image configuration' },
      { status: 500 }
    );
  }
}