import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get query parameters for filtering/pagination
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Check if we should only return admin posts
    const isAdmin = searchParams.get('admin') === 'true';
    
    // Build the MongoDB query
    let mongoQuery: any = {};
    
    // If not admin view, only show published posts
    if (!isAdmin) {
      mongoQuery.published = true;
    }
    
    if (query) {
      mongoQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await db.collection('blogs').countDocuments(mongoQuery);
    
    // Fetch the blog posts
    const posts = await db
      .collection('blogs')
      .find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: (error as Error).message
    }, { status: 500 });
  }
}

// POST a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.title || !body.content) {
      return NextResponse.json({
        success: false,
        message: 'Title and content are required'
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Create a new blog post document
    const newPost = {
      title: body.title,
      content: body.content,
      author: body.author || 'Anonymous',
      tags: body.tags || [],
      published: body.published || false, // Default to unpublished
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the document into MongoDB
    const result = await db.collection('blogs').insertOne(newPost);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        ...newPost,
        _id: result.insertedId
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create blog post',
      error: (error as Error).message
    }, { status: 500 });
  }
}