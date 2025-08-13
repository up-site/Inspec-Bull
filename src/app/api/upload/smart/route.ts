import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ImageProcessor } from '@/lib/imageProcessor';
import { ImageCategory, getImageCategoryConfig } from '@/types/imageCategories';

export async function POST(request: NextRequest) {
  try {
    console.log('Smart upload POST - Starting request');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as ImageCategory | null;
    const generateMobile = formData.get('generateMobile') === 'true';
    const quality = parseInt(formData.get('quality') as string) || 85;

    console.log('Smart upload POST - Parsed form data:', { 
      hasFile: !!file, 
      category, 
      generateMobile, 
      quality 
    });

    if (!file) {
      console.log('Smart upload POST - No file provided');
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Image category is required' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const config = getImageCategoryConfig(category);

    // Validate file size
    const maxSize = config.maxFileSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: `File size too large. Maximum size is ${config.maxFileSize}MB for ${config.label}` 
        },
        { status: 400 }
      );
    }

    // Validate file format
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!config.allowedFormats.includes(fileExt)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid file format. Allowed formats for ${config.label}: ${config.allowedFormats.join(', ').toUpperCase()}` 
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Process image with smart algorithms
    const processingResult = await ImageProcessor.processImage(
      inputBuffer,
      file.name,
      { category, generateMobile, quality }
    );

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', config.folder);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save processed images
    const desktopPath = join(uploadDir, processingResult.desktop.filename);
    await writeFile(desktopPath, processingResult.desktop.buffer);

    const result: any = {
      desktop: {
        filename: processingResult.desktop.filename,
        originalName: file.name,
        size: processingResult.desktop.size,
        width: processingResult.desktop.width,
        height: processingResult.desktop.height,
        format: processingResult.desktop.format,
        url: `/uploads/${config.folder}/${processingResult.desktop.filename}`,
        category,
        processingType: config.processingType
      }
    };

    // Save mobile version if generated
    if (processingResult.mobile) {
      const mobilePath = join(uploadDir, processingResult.mobile.filename);
      await writeFile(mobilePath, processingResult.mobile.buffer);

      result.mobile = {
        filename: processingResult.mobile.filename,
        size: processingResult.mobile.size,
        width: processingResult.mobile.width,
        height: processingResult.mobile.height,
        format: processingResult.mobile.format,
        url: `/uploads/${config.folder}/${processingResult.mobile.filename}`
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Image processed successfully for ${config.label}`,
      config: {
        category,
        label: config.label,
        dimensions: config.dimensions,
        mobileVersion: config.mobileVersion,
        processingType: config.processingType
      }
    });

  } catch (error) {
    console.error('Smart upload error:', error);
    return NextResponse.json(
      { success: false, message: `Failed to process image: ${error.message}` },
      { status: 500 }
    );
  }
}

// Generate preview endpoint
export async function PUT(request: NextRequest) {
  try {
    console.log('Smart upload PUT (preview) - Starting request');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as ImageCategory | null;

    console.log('Smart upload PUT - Parsed form data:', { 
      hasFile: !!file, 
      category 
    });

    if (!file || !category) {
      console.log('Smart upload PUT - Missing file or category');
      return NextResponse.json(
        { success: false, message: 'File and category are required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Generate preview
    const previewBuffer = await ImageProcessor.generatePreview(inputBuffer, category);

    // Convert buffer to base64 for immediate preview
    const previewBase64 = `data:image/jpeg;base64,${previewBuffer.toString('base64')}`;

    const config = getImageCategoryConfig(category);

    return NextResponse.json({
      success: true,
      data: {
        preview: previewBase64,
        originalSize: { width: 0, height: 0 }, // Would need to get from sharp metadata
        targetSize: config.dimensions,
        category,
        label: config.label,
        processingType: config.processingType
      },
      message: 'Preview generated successfully'
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { success: false, message: `Failed to generate preview: ${error.message}` },
      { status: 500 }
    );
  }
}