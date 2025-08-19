'use client';

import React, { useState, useEffect } from 'react';

const CoursesPageSimple: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Simple courses page mounted');
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses in simple page...');
      const response = await fetch('/api/courses', {
        credentials: 'include',
      });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Courses data:', data);
      
      if (data.success) {
        setCourses(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Courses Management (Simple)</h1>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Courses Management (Simple)</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Courses Management (Simple)</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Courses List</h2>
          <p className="text-sm text-gray-600">Found {courses.length} courses</p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses found. The layout is working!</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              This is a test button
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={course._id || index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{course.title || 'Untitled Course'}</h3>
                <p className="text-sm text-gray-600">{course.shortDescription || 'No description'}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {course.status || 'unknown'}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {course.category || 'uncategorized'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPageSimple;