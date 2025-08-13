'use client';

import React, { useState, useEffect } from 'react';
import SmartImageUpload from '@/components/admin/SmartImageUpload';
import { ImageCategory } from '@/types/imageCategories';

interface AboutUs {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  missionStatement?: string;
  visionStatement?: string;
  certificationImages: string[];
  companyImages: string[];
  isActive: boolean;
}

const AboutUsPage: React.FC = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs>({
    title: '',
    subtitle: '',
    description: '',
    missionStatement: '',
    visionStatement: '',
    certificationImages: [],
    companyImages: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      if (data.success) {
        setAboutUs(data.data);
      }
    } catch (error) {
      console.error('Error fetching about us:', error);
      setMessage('Failed to fetch about us data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const method = aboutUs._id ? 'PUT' : 'POST';
      const response = await fetch('/api/about-us', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutUs),
      });

      const data = await response.json();
      if (data.success) {
        setAboutUs(data.data);
        setMessage('About Us updated successfully');
      } else {
        setMessage(data.message || 'Failed to update about us');
      }
    } catch (error) {
      console.error('Error updating about us:', error);
      setMessage('Failed to update about us');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AboutUs, value: string) => {
    setAboutUs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCertificationImage = (imageUrl: string) => {
    if (imageUrl.trim()) {
      setAboutUs(prev => ({
        ...prev,
        certificationImages: [...prev.certificationImages, imageUrl.trim()]
      }));
    }
  };

  const removeCertificationImage = (index: number) => {
    setAboutUs(prev => ({
      ...prev,
      certificationImages: prev.certificationImages.filter((_, i) => i !== index)
    }));
  };

  const addCompanyImage = (imageUrl: string) => {
    if (imageUrl.trim()) {
      setAboutUs(prev => ({
        ...prev,
        companyImages: [...prev.companyImages, imageUrl.trim()]
      }));
    }
  };

  const removeCompanyImage = (index: number) => {
    setAboutUs(prev => ({
      ...prev,
      companyImages: prev.companyImages.filter((_, i) => i !== index)
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
          <h1 className="text-2xl font-bold text-gray-900">About Us Management</h1>
          <p className="text-gray-600">Manage the About Us section displayed on your website</p>
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
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={aboutUs.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                value={aboutUs.subtitle || ''}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={aboutUs.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Mission & Vision</h3>
            
            <div>
              <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700">
                Mission Statement
              </label>
              <textarea
                id="missionStatement"
                rows={3}
                value={aboutUs.missionStatement || ''}
                onChange={(e) => handleInputChange('missionStatement', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="visionStatement" className="block text-sm font-medium text-gray-700">
                Vision Statement
              </label>
              <textarea
                id="visionStatement"
                rows={3}
                value={aboutUs.visionStatement || ''}
                onChange={(e) => handleInputChange('visionStatement', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Certification Images */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Certification Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SmartImageUpload
                category={ImageCategory.CERTIFICATION}
                onImageUploaded={addCertificationImage}
                required={false}
              />
            </div>

            {aboutUs.certificationImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {aboutUs.certificationImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Certification ${index + 1}`}
                      className="w-full h-24 object-contain border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeCertificationImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Images */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Company Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SmartImageUpload
                category={ImageCategory.COMPANY_PHOTO}
                onImageUploaded={addCompanyImage}
                required={false}
              />
            </div>

            {aboutUs.companyImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {aboutUs.companyImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Company ${index + 1}`}
                      className="w-full h-32 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanyImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 border-t pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save About Us'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{aboutUs.title}</h2>
            {aboutUs.subtitle && (
              <p className="text-lg text-gray-600 mt-2">{aboutUs.subtitle}</p>
            )}
          </div>
          <p className="text-gray-700">{aboutUs.description}</p>
          
          {aboutUs.missionStatement && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mission</h3>
              <p className="text-gray-700">{aboutUs.missionStatement}</p>
            </div>
          )}
          
          {aboutUs.visionStatement && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vision</h3>
              <p className="text-gray-700">{aboutUs.visionStatement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;