'use client';

import React, { useState, useRef } from 'react';

interface ImageConfig {
  dimensions: { width: number; height: number; aspectRatio: string };
  mobileVersion?: { width: number; height: number; aspectRatio: string };
  maxFileSize: number;
  allowedFormats: string[];
  folder: string;
  label: string;
  description?: string;
}

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  category?: string; // New prop to fetch configuration
  folder?: string;
  label?: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  category,
  folder = 'general',
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage || '');
  const [config, setConfig] = useState<ImageConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch configuration when category is provided
  React.useEffect(() => {
    if (category) {
      fetchImageConfig();
    }
  }, [category]);

  const fetchImageConfig = async () => {
    if (!category) return;
    
    setConfigLoading(true);
    try {
      const response = await fetch('/api/image-config');
      const data = await response.json();
      if (data.success) {
        const categoryConfig = data.data.find((c: any) => c.category === category);
        if (categoryConfig) {
          setConfig(categoryConfig);
        }
      }
    } catch (error) {
      console.error('Error fetching image config:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  // Use config values if available, otherwise fall back to props
  const effectiveMaxSize = config?.maxFileSize || maxSize;
  const effectiveFolder = config?.folder || folder;
  const effectiveLabel = config?.label || label;
  const effectiveAccept = config ? 
    config.allowedFormats.map(f => `image/${f === 'jpg' ? 'jpeg' : f}`).join(',') : 
    accept;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > effectiveMaxSize * 1024 * 1024) {
      setError(`File size must be less than ${effectiveMaxSize}MB`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', effectiveFolder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageUploaded(data.data.url);
        setPreview(data.data.url);
        setError('');
      } else {
        setError(data.message || 'Upload failed');
        setPreview(currentImage || '');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
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
      <label className="block text-sm font-medium text-gray-700">
        {effectiveLabel} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Configuration Info */}
      {config && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
          <p className="font-medium text-blue-900">Image Requirements:</p>
          <p className="text-blue-700">
            Size: {config.dimensions.width} × {config.dimensions.height}px 
            ({config.dimensions.aspectRatio})
          </p>
          {config.mobileVersion && (
            <p className="text-blue-700">
              Mobile: {config.mobileVersion.width} × {config.mobileVersion.height}px 
              ({config.mobileVersion.aspectRatio})
            </p>
          )}
          <p className="text-blue-700">
            Max size: {config.maxFileSize}MB • Formats: {config.allowedFormats.join(', ').toUpperCase()}
          </p>
          {config.description && (
            <p className="text-blue-600 mt-1">{config.description}</p>
          )}
        </div>
      )}

      {/* Preview Area */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              {config ? 
                `${config.allowedFormats.join(', ').toUpperCase()} up to ${effectiveMaxSize}MB` :
                `PNG, JPG, GIF up to ${effectiveMaxSize}MB`
              }
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={effectiveAccept}
        onChange={handleFileSelect}
        disabled={uploading || configLoading}
        className="hidden"
      />

      {/* Upload button */}
      {!preview && (
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading || configLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
        >
          {configLoading ? (
            'Loading configuration...'
          ) : uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            `Choose ${effectiveLabel}`
          )}
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

export default ImageUpload;