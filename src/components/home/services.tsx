'use client'
import React, { useState, useEffect } from 'react';

interface Service {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  images?: string[]; // Array of images for each service
  category: string;
  link?: string;
  isActive: boolean;
  order: number;
}

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(0); // Track which service is selected

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      if (data.success && data.data) {
        const activeServices = data.data
          .filter((service) => service.isActive)
          .sort((a, b) => a.order - b.order)
          .slice(0, 3);
        setServices(activeServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  // Default services with multiple images for each
  const defaultServices = [
    {
      _id: '1',
      title: 'NDT Courses',
      description: 'Our NDT courses provide hands-on training in various inspection methods like Ultrasonic Testing (UT), Radiographic Testing (RT), and Magnetic Particle Testing (MPT). Designed for professionals across industries, these courses equip you with the skills needed to perform',
      icon: '📚',
      category: 'training',
      isActive: true,
      order: 1,
      images: [
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop'
      ]
    },
    {
      _id: '2',
      title: 'NDT Equipments',
      description: 'NDT equipments includes specialized tools for inspecting materials without causing damage. These tools such as ultrasonic testers, radiographic systems, and magnetic test kits devices are essential in various fields material',
      icon: '🔧',
      category: 'equipment',
      isActive: true,
      order: 2,
      images: [
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ]
    },
    {
      _id: '3',
      title: 'NDT Jobs',
      description: 'NDT jobs involve performing inspections to assess the quality and safety of materials and structures. Professionals in this field work across industries like aerospace, oil & gas, construction, and manufacturing. These jobs require skilled training',
      icon: '💼',
      category: 'jobs',
      isActive: true,
      order: 3,
      images: [
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
      ]
    }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="h-12 bg-gray-200 rounded max-w-2xl mx-auto mb-16"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't show the section if no services from API
  if (!loading && services.length === 0) {
    return null;
  }

  const displayServices = services.length > 0 ? services : defaultServices;
  const currentService = displayServices[selectedService] || displayServices[0];
  
  // Handle both API format (images array) and fallback format
  let currentImages = [];
  if (currentService.images && Array.isArray(currentService.images) && currentService.images.length > 0) {
    currentImages = currentService.images;
  } else {
    // Fallback to default images
    currentImages = [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop'
    ];
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center mb-8 text-sm">
          <span className="text-gray-600">●</span>
          <span className="ml-2 text-gray-700">Services</span>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight">
            "Comprehensive NDT Services for<br />
            Industry-Leading Quality and Accuracy!"
          </h1>
        </div>

        {/* Services Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Service Cards */}
          <div className="space-y-6">
            {displayServices.map((service, index) => (
              <div
                key={service._id || index}
                onClick={() => setSelectedService(index)}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer group relative overflow-hidden ${
                  selectedService === index ? 'ring-2 ring-blue-600 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-colors ${
                      selectedService === index ? 'bg-blue-700' : 'bg-blue-600 group-hover:bg-blue-700'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${
                      selectedService === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                {/* Active indicator line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform transition-transform duration-300 origin-left ${
                  selectedService === index ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
              </div>
            ))}
          </div>

          {/* Right Column - Images */}
          <div className="relative lg:sticky lg:top-8">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden group">
                <img
                  src={currentImages[0]}
                  alt={`${currentService.title} - Main`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Service title overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-semibold drop-shadow-lg">{currentService.title}</h4>
                </div>
              </div>
              
              {/* Two smaller images */}
              <div className="relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden group">
                <img
                  src={currentImages[1]}
                  alt={`${currentService.title} - Image 1`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden group">
                <img
                  src={currentImages[2]}
                  alt={`${currentService.title} - Image 2`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            
            {/* Image transition indicator */}
            <div className="flex justify-center mt-4 gap-2">
              {displayServices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedService(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedService === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Services Button */}
        <div className="text-center mt-16">
          <a
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            Explore All Services
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;