'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  images?: string[];
  category: string;
  link?: string;
  isActive: boolean;
  order: number;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      if (data.success && data.data) {
        const activeServices = data.data
          .filter((service: Service) => service.isActive)
          .sort((a: Service, b: Service) => a.order - b.order);
        setServices(activeServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Services', icon: '<â' },
    { key: 'training', label: 'Training', icon: '=Ú' },
    { key: 'equipment', label: 'Equipment', icon: '='' },
    { key: 'jobs', label: 'Jobs', icon: '=¼' },
    { key: 'inspection', label: 'Inspection', icon: '=' },
    { key: 'testing', label: 'Testing', icon: '—' },
    { key: 'certification', label: 'Certification', icon: '<Æ' },
    { key: 'consulting', label: 'Consulting', icon: '=¡' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">='</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h2>
          <p className="text-gray-600">We're currently updating our services. Please check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Comprehensive NDT solutions for industry-leading quality and accuracy
            </p>
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-white/20 rounded-full px-6 py-2">
                <span className="text-lg font-semibold">{services.length} Services Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
                {category.key !== 'all' && (
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                    {services.filter(s => s.category === category.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-6xl text-white">{service.icon || '=''}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 capitalize">
                    {service.icon && <span className="mr-1">{service.icon}</span>}
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                {/* Action Button */}
                <div className="flex items-center justify-between">
                  {service.link ? (
                    <Link
                      href={service.link}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Learn More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200">
                      More Info
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No services for selected category */}
        {filteredServices.length === 0 && selectedCategory !== 'all' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">=Ë</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found in this category
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or view all services.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team of experts can design customized NDT solutions tailored to your specific industry requirements and challenges.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            Contact Our Experts
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;