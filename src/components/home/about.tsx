'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      if (data.success && data.data) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData || !aboutData.isActive) {
    return null;
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {aboutData.title || 'About InspecBull'}
              </h2>
              {aboutData.subtitle && (
                <p className="text-xl text-blue-600 font-medium mb-6">
                  {aboutData.subtitle}
                </p>
              )}
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {aboutData.description}
              </p>
              
              {/* Mission & Vision */}
              {(aboutData.missionStatement || aboutData.visionStatement) && (
                <div className="space-y-6 mb-8">
                  {aboutData.missionStatement && (
                    <div className="border-l-4 border-blue-600 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
                      <p className="text-gray-600">{aboutData.missionStatement}</p>
                    </div>
                  )}
                  {aboutData.visionStatement && (
                    <div className="border-l-4 border-purple-600 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Vision</h3>
                      <p className="text-gray-600">{aboutData.visionStatement}</p>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/about"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Learn More About Us
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-200"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Certification Badges */}
            {aboutData.certificationImages && aboutData.certificationImages.length > 0 && (
              <div className="mt-12">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                  Our Certifications
                </h4>
                <div className="flex flex-wrap gap-4">
                  {aboutData.certificationImages.slice(0, 4).map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <img
                        src={cert}
                        alt={`Certification ${index + 1}`}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Image Grid */}
          <div className="order-1 lg:order-2">
            {aboutData.companyImages && aboutData.companyImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={aboutData.companyImages[0]}
                      alt="InspecBull Office"
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Smaller images */}
                {aboutData.companyImages.slice(1, 3).map((image, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={image}
                      alt={`InspecBull ${index + 2}`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Fallback pattern if no images
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-12 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Professional NDT Services</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;