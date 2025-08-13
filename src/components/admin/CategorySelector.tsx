'use client';

import React from 'react';
import { ImageCategory, getAllImageCategories, ImageCategoryConfig } from '@/types/imageCategories';

interface CategorySelectorProps {
  selectedCategory?: ImageCategory;
  onCategoryChange: (category: ImageCategory) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  disabled = false,
  required = false,
  label = 'Image Category'
}) => {
  const categories = getAllImageCategories();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value as ImageCategory)}
        disabled={disabled}
        required={required}
        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          Select image category...
        </option>
        {categories.map((config) => (
          <option key={config.category} value={config.category}>
            {config.icon} {config.label}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          {(() => {
            const config = categories.find(c => c.category === selectedCategory);
            if (!config) return null;
            
            return (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-blue-900">
                  {config.icon} {config.label}
                </p>
                <p className="text-blue-700">{config.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-blue-600 mt-2">
                  <span>
                    📐 Size: {config.dimensions.width}×{config.dimensions.height}px ({config.dimensions.aspectRatio})
                  </span>
                  {config.mobileVersion && (
                    <span>
                      📱 Mobile: {config.mobileVersion.width}×{config.mobileVersion.height}px ({config.mobileVersion.aspectRatio})
                    </span>
                  )}
                  <span>
                    💾 Max: {config.maxFileSize}MB
                  </span>
                  <span>
                    🎨 Formats: {config.allowedFormats.join(', ').toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;