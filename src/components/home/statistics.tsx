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
}

const StatisticItem: React.FC<StatisticItemProps> = ({ value, label }) => {
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
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
        {animatedValue.toLocaleString()}
        <span className="text-blue-600 ml-1">+</span>
      </div>
      <div className="text-sm text-gray-600 capitalize">
        {label}
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-2 mx-auto w-32"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-24"></div>
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
      label: 'Projects'
    },
    {
      value: statistics.graduationsCount,
      label: 'Graduations'
    },
    {
      value: statistics.certificationsCount,
      label: 'Certifications'
    },
    {
      value: statistics.countriesCount,
      label: 'Countries'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {statisticsData.map((stat, index) => (
            <StatisticItem
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;