'use client';

import React, { useState, useRef } from 'react';
import { ImageCategory, getImageCategoryConfig } from '@/types/imageCategories';

interface SmartImageUploadProps {
  category: ImageCategory;
  currentImage?: string;
  onImageUploaded: (imageUrl: string, mobileUrl?: string) => void;
  required?: boolean;
  generateMobile?: boolean;
  quality?: number;
}

interface PreviewData {
  original: string;
  processed: string;
  config: any;
}

const SmartImageUpload: React.FC<SmartImageUploadProps> = ({
  category,
  currentImage,
  onImageUploaded,
  required = false,
  generateMobile = false,
  quality = 85
}) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [finalImage, setFinalImage] = useState(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = getImageCategoryConfig(category);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setGenerating(true);

    try {
      // Generate preview first
      const previewFormData = new FormData();
      previewFormData.append('file', file);
      previewFormData.append('category', category);

      const previewResponse = await fetch('/api/upload/smart', {
        method: 'PUT',
        body: previewFormData,
      });

      console.log('Preview response status:', previewResponse.status);
      console.log('Preview response headers:', previewResponse.headers.get('content-type'));

      if (!previewResponse.ok) {
        const errorText = await previewResponse.text();
        console.error('Preview response error:', errorText);
        throw new Error(`HTTP ${previewResponse.status}: ${errorText.substring(0, 100)}...`);
      }

      const previewData = await previewResponse.json();

      if (previewData.success) {
        // Create original preview
        const originalPreview = URL.createObjectURL(file);
        
        setPreview({
          original: originalPreview,
          processed: previewData.data.preview,
          config: previewData.data
        });
      } else {
        setError(previewData.message || 'Failed to generate preview');
      }
    } catch (error) {
      console.error('Preview error:', error);
      setError('Failed to generate preview');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!preview) return;

    setUploading(true);
    setError('');

    try {
      // Get the original file again
      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error('File not found');

      // Upload and process the final image
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('generateMobile', generateMobile.toString());
      formData.append('quality', quality.toString());

      const response = await fetch('/api/upload/smart', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (data.success) {
        setFinalImage(data.data.desktop.url);
        onImageUploaded(data.data.desktop.url, data.data.mobile?.url);
        setPreview(null);
        setError('');
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleReject = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setFinalImage('');
    setPreview(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Category Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{config.icon}</span>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">{config.label}</h3>
            <p className="text-sm text-blue-700 mb-2">{config.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-600">
              <span>📐 Size: {config.dimensions.width}×{config.dimensions.height}px ({config.dimensions.aspectRatio})</span>
              {config.mobileVersion && (
                <span>📱 Mobile: {config.mobileVersion.width}×{config.mobileVersion.height}px ({config.mobileVersion.aspectRatio})</span>
              )}
              <span>💾 Max: {config.maxFileSize}MB</span>
              <span>🎨 {config.allowedFormats.join(', ').toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Image */}
      {finalImage && !preview && (
        <div className="relative">
          <div className="text-sm font-medium text-gray-700 mb-2">Current Image:</div>
          <div className="relative inline-block">
            <img
              src={finalImage}
              alt="Current image"
              className="max-w-full h-48 object-cover border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {preview && (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ✨ Smart Processing Preview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
              <img
                src={preview.original}
                alt="Original"
                className="w-full h-32 object-cover border border-gray-300 rounded"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Processed Result ({config.dimensions.width}×{config.dimensions.height}px)
              </h4>
              <img
                src={preview.processed}
                alt="Processed"
                className="w-full h-32 object-cover border border-green-300 rounded"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-sm text-green-700">
              <strong>Processing Applied:</strong> {config.processingType.replace('-', ' ')} algorithm
              automatically optimized your image to perfect dimensions while preserving important content.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              disabled={uploading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing & Uploading...
                </span>
              ) : (
                '✓ Looks Perfect!'
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={uploading}
              className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Try Different Image
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!finalImage && !preview && (
        <div
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            generating 
              ? 'border-blue-300 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="space-y-2">
            <div className="text-6xl">{config.icon}</div>
            <h3 className="text-lg font-medium text-gray-900">
              {generating ? 'Generating Preview...' : `Upload ${config.label}`}
            </h3>
            <p className="text-gray-600">
              {generating ? 'Processing your image...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              Smart processing will automatically optimize your image to perfect dimensions
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={config.allowedFormats.map(f => `image/${f === 'jpg' ? 'jpeg' : f}`).join(',')}
        onChange={handleFileSelect}
        disabled={generating || uploading}
        className="hidden"
      />

      {/* Upload button */}
      {!finalImage && !preview && (
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={generating || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating Preview...' : `Choose ${config.label}`}
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SmartImageUpload;