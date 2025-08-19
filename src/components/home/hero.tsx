'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

interface CompanyInfo {
  _id: string;
  companyName: string;
  yearsExperience: number;
  rating: number;
}

const Hero: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first active banner only
    fetch('/api/banners?active=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setBanner(data.data[0]); // Get only the first banner
        }
      })
      .catch(error => console.error('Error fetching banners:', error))
      .finally(() => setLoading(false));

    // Fetch company info
    fetch('/api/company-info')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCompanyInfo(data.data);
        }
      })
      .catch(error => console.error('Error fetching company info:', error));
  }, []);

  if (loading) {
    return (
      <div className="relative h-[600px] rounded-3xl bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const renderContent = () => (
    <>
      {/* Content positioned on the left side */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {banner?.title || "Welcome to a world"}
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2">
            {banner?.subtitle?.split('\n')[0] || "Where precision"}
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {banner?.subtitle?.split('\n')[1] || "Meets perfection"}
          </h2>
          <p className="text-base md:text-lg text-gray-200 mb-8 max-w-md">
            {banner?.description || "Lorem ipsum dolor sit amet consectetur. Cum egestas morbi felis semper elit lectus est consequat egestas in venenatis."}
          </p>
          <Link
            href={banner?.ctaLink || "/contact"}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {banner?.ctaText || "Contact Us"}
          </Link>
        </div>

        {/* Experience Badge - positioned at bottom right */}
        {companyInfo && (
          <div className="absolute bottom-8 right-8 bg-gray-900 bg-opacity-80 rounded-lg px-4 py-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(companyInfo.rating))].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-white">
                <div className="font-bold text-2xl">{companyInfo.yearsExperience} Years</div>
                <div className="text-xs text-gray-300">Experience</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (!banner) {
    // Default banner if no banners in database
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative h-[600px] rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={banner.backgroundImage}
            alt={banner.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Hero;