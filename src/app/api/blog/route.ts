// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/../../models/BlogPost';
import { requireAdmin, authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'publishedAt';
    const order = searchParams.get('order') || 'desc';
    
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
    
    // If no status is specified and it's a small limit (likely home page), default to published
    // If it's a large limit (likely admin page), show all statuses
    if (status) {
      filters.status = status;
    } else if (limit <= 10) {
      // Public API call (home page) - only show published
      filters.status = 'published';
    }
    // For admin calls with large limits, don't filter by status (show all)
    
    console.log('Blog API filters:', filters, 'limit:', limit);
    
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      filters.isFeatured = true;
    }
    
    const author = searchParams.get('author');
    if (author) {
      filters.author = author;
    }
    
    const skip = (page - 1) * limit;
    const sortObj: any = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const [posts, total] = await Promise.all([
      BlogPost.find(filters)
        .populate('author', 'name avatar')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filters)
    ]);
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
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
    console.log('Received blog data:', body);
    
    // Generate slug from title
    const slug = body.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this title already exists' },
        { status: 409 }
      );
    }
    
    // Calculate read time (rough estimate: 200 words per minute)
    let wordCount = 0;
    
    if (body.sections && body.sections.length > 0) {
      // Calculate from sections
      wordCount = body.sections.reduce((total: number, section: any) => {
        return total + (section.content ? section.content.split(' ').length : 0);
      }, 0);
    } else if (body.content) {
      // Calculate from old content format
      wordCount = body.content.split(' ').length;
    }
    
    const readTime = Math.ceil(wordCount / 200) || 1;
    
    // Migrate old content format to sections if needed
    if (body.content && (!body.sections || body.sections.length === 0)) {
      body.sections = [{
        id: 'section-1',
        title: 'Main Content',
        content: body.content,
        order: 0,
        type: 'text'
      }];
    }
    
    const blogPost = await BlogPost.create({
      ...body,
      slug,
      author: user._id,
      readTime,
      publishedAt: body.status === 'published' ? new Date() : null,
    });
    
    await blogPost.populate('author', 'name avatar');
    
    return NextResponse.json({
      success: true,
      data: blogPost,
      message: 'Blog post created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create blog post error:', error);
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
      { success: false, error: `Failed to create blog post: ${error.message}` },
      { status: 500 }
    );
  }
}