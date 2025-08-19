'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
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
  isFeatured?: boolean;
  views?: number;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/blog/${blog._id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/blog/${blog._id}`} className="hover:text-blue-600 transition-colors">
            {blog.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <Link 
            href={`/blog/${blog._id}`}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(blog.publishedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogListing: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBanner, setPageBanner] = useState<any>(null);
  const blogsPerPage = 6;

  useEffect(() => {
    fetchBlogs();
    fetchPageBanner();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog?page=${currentPage}&limit=${blogsPerPage}&status=published`);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination?.pages || Math.ceil((data.pagination?.total || 0) / blogsPerPage));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageBanner = async () => {
    try {
      const response = await fetch('/api/page-banners?page=blog');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setPageBanner(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching page banner:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative h-80 rounded-3xl bg-gray-200 animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end pb-12 px-12">
              <div className="h-12 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Blog Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative h-80 rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={pageBanner?.backgroundImage || "/api/placeholder/1920/600"}
              alt={pageBanner?.title || "Blog Hero"}
              fill
              className="object-cover"
            />
            <div 
              className="absolute inset-0 bg-black" 
              style={{ opacity: pageBanner?.overlayOpacity || 0.5 }}
            />
          </div>
          <div className="relative h-full flex items-end pb-12 px-12">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white">
                {pageBanner?.title || "Blogs"}
              </h1>
              {pageBanner?.subtitle && (
                <p className="text-xl text-white/90 mt-4">
                  {pageBanner.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className=" px-4 sm:px-6 lg:px-8 py-4">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blogs found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogListing;