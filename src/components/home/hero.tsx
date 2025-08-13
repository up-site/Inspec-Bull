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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch banners
    fetch('/api/banners?active=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBanners(data.data);
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

  // Auto-rotate banners if multiple banners exist
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="relative h-96 md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    // Default banner if no banners in database
    return (
      <div className="relative h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome to a world
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Where precision
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              Meets perfection
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Leading provider of Non-Destructive Testing services with cutting-edge technology and expert solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentBanner.backgroundImage}
          alt={currentBanner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {currentBanner.title}
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            {currentBanner.subtitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            {currentBanner.description}
          </p>
          <Link
            href={currentBanner.ctaLink}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {currentBanner.ctaText}
          </Link>
        </div>

        {/* Experience Badge */}
        {companyInfo && (
          <div className="absolute bottom-8 right-8 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(companyInfo.rating))].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-gray-800">
                <div className="font-bold text-lg">{companyInfo.yearsExperience} Years</div>
                <div className="text-sm text-gray-600">Experience</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Banner Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default Hero;