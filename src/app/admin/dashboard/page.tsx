'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  banners: number;
  statistics: number;
  clients: number;
  testimonials: number;
  faqs: number;
  aboutUs: number;
  blogPosts: number;
  courses: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    banners: 0,
    statistics: 0,
    clients: 0,
    testimonials: 0,
    faqs: 0,
    aboutUs: 0,
    blogPosts: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const endpoints = [
        { key: 'banners', url: '/api/banners' },
        { key: 'statistics', url: '/api/statistics' },
        { key: 'clients', url: '/api/clients' },
        { key: 'testimonials', url: '/api/testimonials' },
        { key: 'faqs', url: '/api/faq' },
        { key: 'aboutUs', url: '/api/about-us' },
        { key: 'blogPosts', url: '/api/blog' },
        { key: 'courses', url: '/api/courses' }
      ];

      const results = await Promise.allSettled(
        endpoints.map(async ({ key, url }) => {
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
              return { 
                key, 
                count: Array.isArray(data.data) ? data.data.length : (data.data ? 1 : 0)
              };
            }
            return { key, count: 0 };
          } catch {
            return { key, count: 0 };
          }
        })
      );

      const newStats = { ...stats };
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newStats[result.value.key as keyof DashboardStats] = result.value.count;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Add Banner', href: '/admin/banners', icon: '🖼️' },
    { name: 'Add Testimonial', href: '/admin/testimonials', icon: '💬' },
    { name: 'Add FAQ', href: '/admin/faq', icon: '❓' },
    { name: 'Add Client', href: '/admin/clients', icon: '🏢' },
    { name: 'Update Statistics', href: '/admin/statistics', icon: '📊' },
    { name: 'Edit About Us', href: '/admin/about-us', icon: 'ℹ️' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your website.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Hero Banners</h2>
              <p className="text-3xl font-bold">{stats.banners}</p>
            </div>
            <div className="text-4xl opacity-80">🖼️</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Testimonials</h2>
              <p className="text-3xl font-bold">{stats.testimonials}</p>
            </div>
            <div className="text-4xl opacity-80">💬</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Client Logos</h2>
              <p className="text-3xl font-bold">{stats.clients}</p>
            </div>
            <div className="text-4xl opacity-80">🏢</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">FAQ Items</h2>
              <p className="text-3xl font-bold">{stats.faqs}</p>
            </div>
            <div className="text-4xl opacity-80">❓</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Blog Posts</h2>
              <p className="text-3xl font-bold">{stats.blogPosts}</p>
            </div>
            <div className="text-4xl opacity-80">📝</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Courses</h2>
              <p className="text-3xl font-bold">{stats.courses}</p>
            </div>
            <div className="text-4xl opacity-80">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Statistics</h2>
              <p className="text-3xl font-bold">{stats.statistics}</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">About Us</h2>
              <p className="text-3xl font-bold">{stats.aboutUs}</p>
            </div>
            <div className="text-4xl opacity-80">ℹ️</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">{action.icon}</span>
              <span className="font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Content Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hero Banners</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.banners > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stats.banners > 0 ? 'Active' : 'Empty'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Statistics</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.statistics > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stats.statistics > 0 ? 'Configured' : 'Not Set'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">About Us</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.aboutUs > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stats.aboutUs > 0 ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Client Logos</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.clients > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stats.clients > 0 ? `${stats.clients} Clients` : 'No Clients'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Testimonials</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.testimonials > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stats.testimonials > 0 ? `${stats.testimonials} Reviews` : 'No Reviews'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">FAQ Section</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                stats.faqs > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stats.faqs > 0 ? `${stats.faqs} Questions` : 'No FAQs'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {stats.banners === 0 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400">
                <p className="text-sm text-red-700">
                  <strong>Add a hero banner</strong> - Your homepage needs at least one banner
                </p>
              </div>
            )}
            {stats.statistics === 0 && (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-700">
                  <strong>Configure statistics</strong> - Set up your project counters
                </p>
              </div>
            )}
            {stats.testimonials < 3 && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                  <strong>Add more testimonials</strong> - Aim for at least 3-5 client reviews
                </p>
              </div>
            )}
            {stats.faqs < 5 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-400">
                <p className="text-sm text-green-700">
                  <strong>Expand FAQ section</strong> - Add more frequently asked questions
                </p>
              </div>
            )}
            {stats.banners > 0 && stats.statistics > 0 && stats.testimonials >= 3 && stats.faqs >= 5 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-400">
                <p className="text-sm text-green-700">
                  <strong>Great job!</strong> - Your website content looks complete
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;