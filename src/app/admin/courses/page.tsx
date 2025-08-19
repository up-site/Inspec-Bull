'use client';

import React, { useState, useEffect } from 'react';

interface Course {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription: string;
  category: string;
  requirements: string[];
  learningOutcomes: string[];
  status: 'draft' | 'published' | 'archived';
  isPopular: boolean;
  isFeatured: boolean;
  // Future online course fields (optional)
  level?: string;
  price?: number;
  originalPrice?: number;
  duration?: number;
  thumbnail?: string;
  previewVideo?: string;
  targetAudience?: string[];
  tags?: string[];
  instructor?: {
    _id: string;
    name: string;
    email: string;
  };
  enrollment?: {
    currentEnrollment: number;
    maxStudents?: number;
  };
  ratings?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORIES = [
  'safety-inspection',
  'equipment-training',
  'certification',
  'compliance',
  'advanced-techniques'
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '',
    shortDescription: '',
    category: 'safety-inspection',
    requirements: [''],
    learningOutcomes: [''],
    status: 'draft',
    isPopular: false,
    isFeatured: false
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Filter out empty arrays
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        learningOutcomes: formData.learningOutcomes.filter(outcome => outcome.trim() !== ''),
      };

      const token = localStorage.getItem('token');
      const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingCourse ? 'Course updated successfully' : 'Course created successfully');
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
        fetchCourses();
      } else {
        setMessage(data.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setMessage('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      requirements: course.requirements.length > 0 ? course.requirements : [''],
      learningOutcomes: course.learningOutcomes.length > 0 ? course.learningOutcomes : [''],
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to archive this course?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Course archived successfully');
        fetchCourses();
      } else {
        setMessage(data.error || 'Failed to archive course');
      }
    } catch (error) {
      console.error('Error archiving course:', error);
      setMessage('Failed to archive course');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'safety-inspection',
      requirements: [''],
      learningOutcomes: [''],
      status: 'draft',
      isPopular: false,
      isFeatured: false
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleArrayInputChange = (field: 'requirements' | 'learningOutcomes', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'learningOutcomes') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'learningOutcomes', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-600">Manage offline training courses - clients inquire for pricing & schedule</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Course
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
                  {course.status}
                </span>
                <div className="flex space-x-1">
                  {course.isPopular && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Popular
                    </span>
                  )}
                  {course.isFeatured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.shortDescription}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="capitalize">{course.category.replace('-', ' ')}</span>
                </div>
                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <span className="font-medium">Requirements:</span>
                    <ul className="list-disc list-inside mt-1 text-xs">
                      {course.requirements.slice(0, 2).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                      {course.requirements.length > 2 && (
                        <li className="text-gray-400">+{course.requirements.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div>
                    <span className="font-medium">Learning Outcomes:</span>
                    <ul className="list-disc list-inside mt-1 text-xs">
                      {course.learningOutcomes.slice(0, 2).map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                      {course.learningOutcomes.length > 2 && (
                        <li className="text-gray-400">+{course.learningOutcomes.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-800 font-medium">📞 Offline Course - Contact us for details</p>
                    <p className="text-xs text-blue-600 mt-1">Schedule, pricing, and enrollment available on inquiry</p>
                  </div>
                  <button 
                    onClick={() => window.open('/contact', '_blank')}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  >
                    Inquire
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id!)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No courses found. Add your first course!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingCourse ? 'Edit Course' : 'Add Course'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                  Short Description *
                </label>
                <textarea
                  id="shortDescription"
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description for course cards (max 200 characters)"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Full Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">ℹ️</span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Offline Course Information</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This is an offline course. Pricing, duration, and schedule details will be provided upon inquiry. 
                      Future online course features can be added later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Arrays */}
              {['requirements', 'learningOutcomes'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === 'learningOutcomes' ? 'Learning Outcomes' : 
                     field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="space-y-2">
                    {formData[field as keyof Pick<Course, 'requirements' | 'learningOutcomes'>].map((item: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayInputChange(field as any, index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Add ${field === 'learningOutcomes' ? 'learning outcome' : field.slice(0, -1)}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem(field as any, index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem(field as any)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add {field === 'learningOutcomes' ? 'Learning Outcome' : 
                             field.slice(0, -1)}
                    </button>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                    Mark as Popular
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;