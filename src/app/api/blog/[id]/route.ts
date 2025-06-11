// src/app/api/blog/[id]/route.ts
import { NextRequest } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import BlogPost from '../../../../../models/BlogPost';
import { createResponse, createErrorResponse } from '../../../../lib/api';
import { blogPostSchema } from '../../../../lib/validation';
import { requireAdmin } from '../../../../lib/auth';
import { generateSlug, calculateReadTime } from '../../../../lib/utils';
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
      return createErrorResponse('Blog post not found', 404);
    }
    
    // Only increment views for published posts and slug access (not admin access)
    if (blogPost.status === 'published' && !isValidObjectId(params.id)) {
      blogPost.views += 1;
      await blogPost.save();
    }
    
    return createResponse(blogPost, 'Blog post retrieved successfully');
  } catch (error: any) {
    console.error('Get blog post error:', error);
    return createErrorResponse('Failed to fetch blog post', 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const validatedData = blogPostSchema.partial().parse(body);
    
    // Admin operations should use ObjectId only
    if (!isValidObjectId(params.id)) {
      return createErrorResponse('Invalid blog post ID', 400);
    }
    
    const blogPost = await BlogPost.findById(params.id);
    
    if (!blogPost) {
      return createErrorResponse('Blog post not found', 404);
    }
    
    let newSlug = blogPost.slug;
    if (validatedData.title && validatedData.title !== blogPost.title) {
      newSlug = generateSlug(validatedData.title);
      
      const existingPost = await BlogPost.findOne({ 
        slug: newSlug, 
        _id: { $ne: blogPost._id } 
      });
      if (existingPost) {
        return createErrorResponse('A post with this title already exists', 409);
      }
    }
    
    let readTime = blogPost.readTime;
    if (validatedData.content) {
      readTime = calculateReadTime(validatedData.content);
    }
    
    let publishedAt = blogPost.publishedAt;
    if (validatedData.status === 'published' && !publishedAt) {
      publishedAt = new Date();
    } else if (validatedData.status !== 'published') {
      publishedAt = null;
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      blogPost._id,
      {
        ...validatedData,
        slug: newSlug,
        readTime,
        publishedAt,
      },
      { new: true }
    ).populate('author', 'name avatar');
    
    return createResponse(updatedPost, 'Blog post updated successfully');
  } catch (error: any) {
    console.error('Update blog post error:', error);
    
    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    
    return createErrorResponse('Failed to update blog post', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);
    
    // Admin operations should use ObjectId only
    if (!isValidObjectId(params.id)) {
      return createErrorResponse('Invalid blog post ID', 400);
    }
    
    await connectDB();
    
    const blogPost = await BlogPost.findByIdAndDelete(params.id);
    
    if (!blogPost) {
      return createErrorResponse('Blog post not found', 404);
    }
    
    return createResponse(null, 'Blog post deleted successfully');
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return createErrorResponse('Failed to delete blog post', 500);
  }
}