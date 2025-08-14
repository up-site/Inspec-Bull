// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/../../models/BlogPost';
import { authenticateToken } from '@/lib/auth';
import { isValidObjectId } from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

// Helper function to find post by ID or slug
async function findPost(identifier: string) {
  await connectDB();
  
  // Check if it's a valid MongoDB ObjectId
  if (isValidObjectId(identifier)) {
    return await BlogPost.findById(identifier)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
  } else {
    // Treat as slug
    return await BlogPost.findOne({ slug: identifier })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const blogPost = await findPost(params.id);
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Only increment views for published posts and slug access (not admin access)
    if (blogPost.status === 'published' && !isValidObjectId(params.id)) {
      blogPost.views += 1;
      await blogPost.save();
    }
    
    return NextResponse.json({
      success: true,
      data: blogPost,
      message: 'Blog post retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    console.log('Updating blog with data:', body);
    
    // Admin operations should use ObjectId only
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    const blogPost = await BlogPost.findById(params.id);
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    let newSlug = blogPost.slug;
    if (body.title && body.title !== blogPost.title) {
      newSlug = body.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const existingPost = await BlogPost.findOne({ 
        slug: newSlug, 
        _id: { $ne: blogPost._id } 
      });
      if (existingPost) {
        return NextResponse.json(
          { success: false, error: 'A post with this title already exists' },
          { status: 409 }
        );
      }
    }
    
    let readTime = blogPost.readTime;
    if (body.content) {
      readTime = Math.ceil(body.content.split(' ').length / 200);
    }
    
    let publishedAt = blogPost.publishedAt;
    if (body.status === 'published' && !publishedAt) {
      publishedAt = new Date();
    } else if (body.status !== 'published') {
      publishedAt = null;
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      blogPost._id,
      {
        ...body,
        slug: newSlug,
        readTime,
        publishedAt,
      },
      { new: true }
    ).populate('author', 'name avatar');
    
    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Blog post updated successfully'
    });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to update blog post: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Admin operations should use ObjectId only
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const blogPost = await BlogPost.findByIdAndDelete(params.id);
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}