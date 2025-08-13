'use client';

import React, { useState, useEffect } from 'react';
import CategorySelector from '@/components/admin/CategorySelector';
import { ImageCategory, getAllImageCategories } from '@/types/imageCategories';

interface ImageConfig {
  _id?: string;
  category: string;
  label: string;
  description?: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  mobileVersion?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  maxFileSize: number;
  allowedFormats: string[];
  folder: string;
  examples?: string[];
  isActive: boolean;
}

const ImageConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<ImageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ImageConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<ImageConfig>({
    category: ImageCategory.BANNER,
    label: '',
    description: '',
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    mobileVersion: { width: 768, height: 1024, aspectRatio: '3:4' },
    maxFileSize: 5,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    folder: '',
    examples: [],
    isActive: true
  });

  const formatOptions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const commonAspectRatios = ['16:9', '4:3', '3:2', '1:1', '3:4', '9:16', '21:9'];

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/image-config');
      const data = await response.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const handleDimensionChange = (
    type: 'dimensions' | 'mobileVersion',
    field: 'width' | 'height',
    value: number
  ) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      const currentDimensions = newFormData[type];
      
      if (currentDimensions) {
        currentDimensions[field] = value;
        currentDimensions.aspectRatio = calculateAspectRatio(
          currentDimensions.width,
          currentDimensions.height
        );
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const url = editingConfig ? '/api/image-config' : '/api/image-config';
      const method = editingConfig ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingConfig ? 'Configuration updated successfully' : 'Configuration created successfully');
        setShowModal(false);
        setEditingConfig(null);
        resetForm();
        fetchConfigs();
      } else {
        setMessage(data.message || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (config: ImageConfig) => {
    setEditingConfig(config);
    setFormData({ ...config });
    setShowModal(true);
  };

  const handleDelete = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    try {
      const response = await fetch(`/api/image-config/${configId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Configuration deleted successfully');
        fetchConfigs();
      } else {
        setMessage(data.message || 'Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      setMessage('Failed to delete configuration');
    }
  };

  const resetForm = () => {
    setFormData({
      category: ImageCategory.BANNER,
      label: '',
      description: '',
      dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
      mobileVersion: { width: 768, height: 1024, aspectRatio: '3:4' },
      maxFileSize: 5,
      allowedFormats: ['jpg', 'jpeg', 'png'],
      folder: '',
      examples: [],
      isActive: true
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingConfig(null);
    setShowModal(true);
  };

  const toggleFormat = (format: string) => {
    setFormData(prev => ({
      ...prev,
      allowedFormats: prev.allowedFormats.includes(format)
        ? prev.allowedFormats.filter(f => f !== format)
        : [...prev.allowedFormats, format]
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
          <h1 className="text-2xl font-bold text-gray-900">Image Configuration</h1>
          <p className="text-gray-600">Manage image size requirements and settings for different categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Configuration
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
        {configs.map((config) => (
          <div key={config._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
                <p className="text-sm text-gray-600 mb-2">Category: {config.category}</p>
                {config.description && (
                  <p className="text-gray-700">{config.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(config)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(config._id!)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-900 mb-2">Desktop Size</h4>
                <p className="text-sm text-gray-600">
                  {config.dimensions.width} × {config.dimensions.height}px
                </p>
                <p className="text-sm text-gray-500">
                  Ratio: {config.dimensions.aspectRatio}
                </p>
              </div>

              {config.mobileVersion && (
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-2">Mobile Size</h4>
                  <p className="text-sm text-gray-600">
                    {config.mobileVersion.width} × {config.mobileVersion.height}px
                  </p>
                  <p className="text-sm text-gray-500">
                    Ratio: {config.mobileVersion.aspectRatio}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-900 mb-2">File Settings</h4>
                <p className="text-sm text-gray-600">Max: {config.maxFileSize}MB</p>
                <p className="text-sm text-gray-500">
                  Formats: {config.allowedFormats.join(', ').toUpperCase()}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-900 mb-2">Storage</h4>
                <p className="text-sm text-gray-600">/{config.folder}/</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {config.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {configs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No image configurations found. Add your first configuration!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CategorySelector
                    selectedCategory={formData.category as ImageCategory}
                    onCategoryChange={(category) => {
                      const categoryConfig = getAllImageCategories().find(c => c.category === category);
                      if (categoryConfig) {
                        setFormData({
                          ...formData,
                          category,
                          label: categoryConfig.label,
                          description: categoryConfig.description,
                          dimensions: categoryConfig.dimensions,
                          mobileVersion: categoryConfig.mobileVersion,
                          maxFileSize: categoryConfig.maxFileSize,
                          allowedFormats: categoryConfig.allowedFormats,
                          folder: categoryConfig.folder
                        });
                      }
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                    Label *
                  </label>
                  <input
                    type="text"
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Hero Banners"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of these images"
                />
              </div>

              {/* Desktop Dimensions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Desktop Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Width (px) *</label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleDimensionChange('dimensions', 'width', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (px) *</label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleDimensionChange('dimensions', 'height', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                    <input
                      type="text"
                      value={formData.dimensions.aspectRatio}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Dimensions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Mobile Dimensions (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Width (px)</label>
                    <input
                      type="number"
                      value={formData.mobileVersion?.width || ''}
                      onChange={(e) => handleDimensionChange('mobileVersion', 'width', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (px)</label>
                    <input
                      type="number"
                      value={formData.mobileVersion?.height || ''}
                      onChange={(e) => handleDimensionChange('mobileVersion', 'height', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                    <input
                      type="text"
                      value={formData.mobileVersion?.aspectRatio || ''}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">
                    Max File Size (MB) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="maxFileSize"
                    value={formData.maxFileSize}
                    onChange={(e) => setFormData({ ...formData, maxFileSize: parseFloat(e.target.value) || 5 })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
                    Upload Folder *
                  </label>
                  <input
                    type="text"
                    id="folder"
                    value={formData.folder}
                    onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., banners, services"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allowed Formats *
                </label>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((format) => (
                    <label key={format} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowedFormats.includes(format)}
                        onChange={() => toggleFormat(format)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{format.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
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
                  {saving ? 'Saving...' : (editingConfig ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConfigPage;