// src/app/api/blog/route.ts
import { NextRequest } from 'next/server';
import connectDB from '../../../lib/mongodb';
import BlogPost from '../../../../models/BlogPost';
import { createResponse, createErrorResponse, createPaginatedResponse, parsePaginationParams, buildSortObject } from '../../../lib/api';
import { blogPostSchema } from '../../../lib/validation';
import { requireAdmin } from '../../../lib/auth';
import { generateSlug, calculateReadTime } from '../../../lib/utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const { page, limit, sort, order } = parsePaginationParams(searchParams);
    
    const filters: any = {};
    
    const search = searchParams.get('search');
    if (search) {
      filters.$text = { $search: search };
    }
    
    const category = searchParams.get('category');
    if (category) {
      filters.category = category;
    }
    
    const status = searchParams.get('status');
    if (status) {
      filters.status = status;
    } else {
      filters.status = 'published';
    }
    
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      filters.isFeatured = true;
    }
    
    const author = searchParams.get('author');
    if (author) {
      filters.author = author;
    }
    
    const skip = (page - 1) * limit;
    const sortObj = buildSortObject(sort, order);
    
    const [posts, total] = await Promise.all([
      BlogPost.find(filters)
        .populate('author', 'name avatar')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filters)
    ]);
    
    return createPaginatedResponse(posts, { page, limit, total });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return createErrorResponse('Failed to fetch blog posts', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    await connectDB();
    
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);
    
    const slug = generateSlug(validatedData.title);
    
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return createErrorResponse('A post with this title already exists', 409);
    }
    
    const readTime = calculateReadTime(validatedData.content);
    
    const blogPost = await BlogPost.create({
      ...validatedData,
      slug,
      author: user._id,
      readTime,
      publishedAt: validatedData.status === 'published' ? new Date() : null,
    });
    
    await blogPost.populate('author', 'name avatar');
    
    return createResponse(blogPost, 'Blog post created successfully', 201);
  } catch (error: any) {
    console.error('Create blog post error:', error);
    
    if (error.name === 'ZodError') {
      return createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    
    return createErrorResponse('Failed to create blog post', 500);
  }
}