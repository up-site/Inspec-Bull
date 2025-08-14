'use client';

import React, { useState, useEffect } from 'react';

interface Statistics {
  _id?: string;
  projectsCount: number;
  graduationsCount: number;
  certificationsCount: number;
  countriesCount: number;
  isActive: boolean;
}

interface StatisticItemProps {
  value: number;
  label: string;
  icon: string;
  color: string;
}

const StatisticItem: React.FC<StatisticItemProps> = ({ value, label, icon, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedValue(Math.round(stepValue * currentStep));
      } else {
        setAnimatedValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group text-center transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <div className={`text-5xl mb-2 transition-colors duration-300 ${color}`}>
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {animatedValue.toLocaleString()}
          <span className="text-blue-600">+</span>
        </div>
        <div className="text-lg font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </div>
        
        {/* Hover effect underline */}
        <div className={`mt-2 h-1 w-0 group-hover:w-full transition-all duration-300 mx-auto rounded-full ${color.replace('text-', 'bg-')}`}></div>
      </div>
    </div>
  );
};

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      if (data.success && data.data) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!statistics || !statistics.isActive) {
    return null;
  }

  const statisticsData = [
    {
      value: statistics.projectsCount,
      label: 'Projects Completed',
      icon: '🎯',
      color: 'text-blue-600'
    },
    {
      value: statistics.graduationsCount,
      label: 'Students Graduated',
      icon: '🎓',
      color: 'text-green-600'
    },
    {
      value: statistics.certificationsCount,
      label: 'Certifications Offered',
      icon: '🏆',
      color: 'text-purple-600'
    },
    {
      value: statistics.countriesCount,
      label: 'Countries Served',
      icon: '🌍',
      color: 'text-red-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Achievement</span> Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering excellence across the globe with measurable results and trusted partnerships
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statisticsData.map((stat, index) => (
            <StatisticItem
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="text-sm font-medium">TRUSTED BY INDUSTRY LEADERS</span>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;