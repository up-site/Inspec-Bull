import React from 'react';
import Hero from '@/components/home/hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Additional sections can be added here */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Leading NDT Solutions Provider
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              With over a decade of experience in Non-Destructive Testing, 
              we provide comprehensive inspection services using cutting-edge technology 
              and certified professionals to ensure the highest quality standards.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}