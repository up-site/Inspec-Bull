'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BlogSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'image' | 'quote';
}

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  sections?: BlogSection[];
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  readTime: number;
  slug: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
}

const BlogDetailPage: React.FC = () => {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetchBlog(params.id as string);
    }
  }, [params?.id]);

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.data);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSectionsToRender = (): BlogSection[] => {
    if (!blog) return [];
    
    if (blog.sections && blog.sections.length > 0) {
      return blog.sections.sort((a, b) => a.order - b.order);
    }
    
    if (blog.content) {
      return [{
        id: 'legacy-content',
        title: 'Lorem ipsum dolor sit amet consectetur. Elit gravida',
        content: blog.content,
        order: 0,
        type: 'text'
      }];
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const sectionsToRender = getSectionsToRender();

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image */}
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="mx-2">·</span>
          <span>{blog.readTime} min. read</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {blog.title}
        </h1>

        {/* Share Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Share</h3>
          <div className="flex flex-col space-y-3">
            <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"/>
              </svg>
              Facebook
            </a>
            <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First paragraph - larger text */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            {blog.excerpt}
          </p>

          {/* Blog sections */}
          {sectionsToRender.map((section) => (
            <div key={section.id} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {section.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;

