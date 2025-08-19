'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SmartImageUpload from '@/components/admin/SmartImageUpload';
import { ImageCategory } from '@/types/imageCategories';

interface PageBanner {
  _id?: string;
  page: string;
  title: string;
  subtitle?: string;
  backgroundImage: string;
  overlayOpacity?: number;
  isActive: boolean;
}

const PageBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PageBanner | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<PageBanner>({
    page: 'blog',
    title: '',
    subtitle: '',
    backgroundImage: '',
    overlayOpacity: 0.4,
    isActive: true
  });

  const pages = [
    { value: 'blog', label: 'Blog Page' },
    { value: 'services', label: 'Services Page' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'courses', label: 'Courses Page' }
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/page-banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const url = editingBanner 
        ? `/api/page-banners/${editingBanner._id}`
        : '/api/page-banners';
      const method = editingBanner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
        setShowModal(false);
        setEditingBanner(null);
        resetForm();
        fetchBanners();
      } else {
        setMessage(data.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      setMessage('Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner: PageBanner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setShowModal(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/page-banners/${bannerId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Banner deleted successfully');
        fetchBanners();
      } else {
        setMessage(data.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      setMessage('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setFormData({
      page: 'blog',
      title: '',
      subtitle: '',
      backgroundImage: '',
      overlayOpacity: 0.4,
      isActive: true
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingBanner(null);
    setShowModal(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Page Banners</h1>
          <p className="text-gray-600">Manage hero banners for different pages</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Banner
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-64 h-48">
                <Image
                  src={banner.backgroundImage}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: banner.overlayOpacity || 0.4 }}
                />
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Page: {pages.find(p => p.value === banner.page)?.label || banner.page}
                    </p>
                    {banner.subtitle && (
                      <p className="text-gray-700 mt-2">{banner.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id!)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No page banners found. Add your first banner!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingBanner ? 'Edit Banner' : 'Add Banner'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="page" className="block text-sm font-medium text-gray-700">
                  Page *
                </label>
                <select
                  id="page"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!!editingBanner}
                >
                  {pages.map((page) => (
                    <option key={page.value} value={page.value}>
                      {page.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Our Blog"
                  required
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Latest insights and updates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image *
                </label>
                <SmartImageUpload
                  currentImage={formData.backgroundImage}
                  category={ImageCategory.BLOG_PAGE_BANNER}
                  onImageUploaded={(url) => setFormData({ ...formData, backgroundImage: url })}
                  required
                />
              </div>

              <div>
                <label htmlFor="overlayOpacity" className="block text-sm font-medium text-gray-700">
                  Overlay Opacity ({(formData.overlayOpacity || 0.4) * 100}%)
                </label>
                <input
                  type="range"
                  id="overlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.overlayOpacity || 0.4}
                  onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) })}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingBanner ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBannersPage;