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

const StatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    projectsCount: 0,
    graduationsCount: 0,
    certificationsCount: 0,
    countriesCount: 0,
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setMessage('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const method = statistics._id ? 'PUT' : 'POST';
      const response = await fetch('/api/statistics', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statistics),
      });

      const data = await response.json();
      if (data.success) {
        setStatistics(data.data);
        setMessage('Statistics updated successfully');
      } else {
        setMessage(data.message || 'Failed to update statistics');
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
      setMessage('Failed to update statistics');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Statistics, value: number) => {
    setStatistics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics Management</h1>
          <p className="text-gray-600">Manage the counters displayed on your homepage</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectsCount" className="block text-sm font-medium text-gray-700">
                Projects Count
              </label>
              <input
                type="number"
                id="projectsCount"
                min="0"
                value={statistics.projectsCount}
                onChange={(e) => handleInputChange('projectsCount', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Number of completed projects</p>
            </div>

            <div>
              <label htmlFor="graduationsCount" className="block text-sm font-medium text-gray-700">
                Graduations Count
              </label>
              <input
                type="number"
                id="graduationsCount"
                min="0"
                value={statistics.graduationsCount}
                onChange={(e) => handleInputChange('graduationsCount', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Number of graduates</p>
            </div>

            <div>
              <label htmlFor="certificationsCount" className="block text-sm font-medium text-gray-700">
                Certifications Count
              </label>
              <input
                type="number"
                id="certificationsCount"
                min="0"
                value={statistics.certificationsCount}
                onChange={(e) => handleInputChange('certificationsCount', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Number of certifications offered</p>
            </div>

            <div>
              <label htmlFor="countriesCount" className="block text-sm font-medium text-gray-700">
                Countries Count
              </label>
              <input
                type="number"
                id="countriesCount"
                min="0"
                value={statistics.countriesCount}
                onChange={(e) => handleInputChange('countriesCount', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Number of countries served</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Statistics'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Display</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{statistics.projectsCount}+</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{statistics.graduationsCount}+</div>
            <div className="text-sm text-gray-600">Graduations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{statistics.certificationsCount}+</div>
            <div className="text-sm text-gray-600">Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{statistics.countriesCount}+</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;