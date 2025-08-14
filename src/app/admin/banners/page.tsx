'use client';

import React, { useState, useEffect } from 'react';
import SmartImageUpload from '@/components/admin/SmartImageUpload';
import { ImageCategory } from '@/types/imageCategories';

interface HeroBanner {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  mobileBackgroundImage?: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

const BannersPage: React.FC = () => {
  const [heroBanner, setHeroBanner] = useState<HeroBanner>({
    title: '',
    subtitle: '',
    description: '',
    backgroundImage: '',
    mobileBackgroundImage: '',
    ctaText: '',
    ctaLink: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHeroBanner();
  }, []);

  const fetchHeroBanner = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        // Get the first (and only) banner or create default structure
        const banner = data.data[0] || heroBanner;
        setHeroBanner(banner);
      }
    } catch (error) {
      console.error('Error fetching hero banner:', error);
      setMessage('Failed to fetch hero banner data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const url = heroBanner._id ? `/api/banners/${heroBanner._id}` : '/api/banners';
      const method = heroBanner._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroBanner),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Hero banner updated successfully');
        setHeroBanner(data.data);
      } else {
        setMessage(data.message || 'Failed to save hero banner');
      }
    } catch (error) {
      console.error('Error saving hero banner:', error);
      setMessage('Failed to save hero banner');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof HeroBanner, value: string | boolean) => {
    setHeroBanner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Banner Management</h1>
          <p className="text-gray-600">Manage the main hero banner displayed on your homepage</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preview Section */}
          {heroBanner.backgroundImage && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Hero Banner</h3>
              <div 
                className="h-64 bg-cover bg-center relative rounded-lg overflow-hidden"
                style={{ backgroundImage: `url(${heroBanner.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-3xl font-bold mb-2">{heroBanner.title}</h2>
                    <p className="text-xl mb-4">{heroBanner.subtitle}</p>
                    <p className="text-sm mb-4 opacity-90">{heroBanner.description}</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                      {heroBanner.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Main Title *
              </label>
              <input
                type="text"
                id="title"
                value={heroBanner.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Welcome to InspecBull"
                required
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                Subtitle *
              </label>
              <input
                type="text"
                id="subtitle"
                value={heroBanner.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Professional NDT Services"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              value={heroBanner.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your trusted partner for comprehensive non-destructive testing solutions..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Background Image *
            </label>
            <SmartImageUpload
              category={ImageCategory.BANNER}
              currentImage={heroBanner.backgroundImage}
              onImageUploaded={(imageUrl, mobileUrl) => {
                handleInputChange('backgroundImage', imageUrl);
                if (mobileUrl) {
                  handleInputChange('mobileBackgroundImage', mobileUrl);
                }
              }}
              required
              generateMobile={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
                Call-to-Action Button Text *
              </label>
              <input
                type="text"
                id="ctaText"
                value={heroBanner.ctaText}
                onChange={(e) => handleInputChange('ctaText', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Get Started"
                required
              />
            </div>

            <div>
              <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
                Call-to-Action Button Link *
              </label>
              <input
                type="url"
                id="ctaLink"
                value={heroBanner.ctaLink}
                onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="/contact"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={heroBanner.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Display hero banner on homepage
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 border-t pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Hero Banner'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default BannersPage;