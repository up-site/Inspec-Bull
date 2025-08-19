'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

interface CompanyInfo {
  _id?: string;
  companyName: string;
  email: string;
  supportEmail: string;
  phone: string[];
  headOfficeAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    fullAddress: string;
  };
  branchOffices: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  }[];
  logo: string;
  favicon?: string;
  yearsExperience: number;
  rating: number;
  description: string;
  missionStatement?: string;
  visionStatement?: string;
  coreValues: string[];
  certifications: string[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  contactInfo: {
    tollFreeNumber?: string;
    emergencyContact?: string;
    customerService?: string;
  };
  businessInfo?: {
    registrationNumber?: string;
    taxId?: string;
    establishedYear?: number;
    industry?: string;
    website?: string;
  };
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  timeZone: string;
  languages: string[];
}

const CompanyDetailsPage = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: 'Inspec Bull International',
    email: 'info@inspecbull.com',
    supportEmail: 'support@inspecbull.com',
    phone: ['+91 8891 209 432'],
    headOfficeAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
      fullAddress: ''
    },
    branchOffices: [],
    logo: '',
    favicon: '',
    yearsExperience: 10,
    rating: 5,
    description: '',
    missionStatement: '',
    visionStatement: '',
    coreValues: [''],
    certifications: [''],
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      whatsapp: ''
    },
    contactInfo: {
      tollFreeNumber: '',
      emergencyContact: '',
      customerService: ''
    },
    businessInfo: {
      registrationNumber: '',
      taxId: '',
      establishedYear: new Date().getFullYear(),
      industry: 'Non-Destructive Testing',
      website: 'https://inspecbull.com'
    },
    workingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    timeZone: 'Asia/Kolkata',
    languages: ['English', 'Hindi']
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company-info');
      const data = await response.json();
      if (data.success && data.data) {
        // Ensure all required properties exist
        setCompanyInfo(prev => ({
          ...prev,
          ...data.data,
          phone: data.data.phone || prev.phone || ['+91 8891 209 432'],
          headOfficeAddress: data.data.headOfficeAddress || prev.headOfficeAddress,
          branchOffices: data.data.branchOffices || prev.branchOffices || [],
          coreValues: data.data.coreValues || prev.coreValues || [''],
          certifications: data.data.certifications || prev.certifications || [''],
          socialLinks: data.data.socialLinks || prev.socialLinks,
          contactInfo: data.data.contactInfo || prev.contactInfo,
          businessInfo: data.data.businessInfo || prev.businessInfo,
          workingHours: data.data.workingHours || prev.workingHours,
          languages: data.data.languages || prev.languages || ['English', 'Hindi']
        }));
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      setMessage('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!companyInfo.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!companyInfo.email?.trim()) {
      newErrors.email = 'Primary email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!companyInfo.supportEmail?.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.supportEmail)) {
      newErrors.supportEmail = 'Please enter a valid support email address';
    }

    if (!companyInfo.phone || companyInfo.phone.length === 0 || !companyInfo.phone[0]?.trim()) {
      newErrors.phone = 'At least one phone number is required';
    }

    if (!companyInfo.logo?.trim()) {
      newErrors.logo = 'Company logo is required';
    }

    if (!companyInfo.businessInfo?.industry?.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!companyInfo.businessInfo?.website?.trim()) {
      newErrors.website = 'Website is required';
    } else if (!/^https?:\/\/[^\s]+$/.test(companyInfo.businessInfo.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    if (!validateForm()) {
      setMessage('Please fix the validation errors below');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch('/api/company-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyInfo)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage('Company information updated successfully');
        setCompanyInfo(data.data);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.error || data.message || 'Failed to update company information');
      }
    } catch (error) {
      console.error('Error updating company info:', error);
      setMessage('Network error: Failed to update company information');
    } finally {
      setSaving(false);
    }
  };

  const addPhoneNumber = () => {
    setCompanyInfo(prev => ({
      ...prev,
      phone: [...(prev.phone || []), '']
    }));
  };

  const removePhoneNumber = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      phone: (prev.phone || []).filter((_, i) => i !== index)
    }));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      phone: (prev.phone || []).map((phone, i) => i === index ? value : phone)
    }));
  };

  const addBranchOffice = () => {
    setCompanyInfo(prev => ({
      ...prev,
      branchOffices: [...(prev.branchOffices || []), { name: '', address: '', phone: '', email: '' }]
    }));
  };

  const removeBranchOffice = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      branchOffices: (prev.branchOffices || []).filter((_, i) => i !== index)
    }));
  };

  const updateBranchOffice = (index: number, field: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      branchOffices: (prev.branchOffices || []).map((office, i) => 
        i === index ? { ...office, [field]: value } : office
      )
    }));
  };

  const addCoreValue = () => {
    setCompanyInfo(prev => ({
      ...prev,
      coreValues: [...(prev.coreValues || []), '']
    }));
  };

  const removeCoreValue = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      coreValues: (prev.coreValues || []).filter((_, i) => i !== index)
    }));
  };

  const updateCoreValue = (index: number, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      coreValues: (prev.coreValues || []).map((val, i) => i === index ? value : val)
    }));
  };

  const addCertification = () => {
    setCompanyInfo(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), '']
    }));
  };

  const removeCertification = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index: number, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert, i) => i === index ? value : cert)
    }));
  };

  const addLanguage = () => {
    setCompanyInfo(prev => ({
      ...prev,
      languages: [...(prev.languages || []), '']
    }));
  };

  const removeLanguage = (index: number) => {
    setCompanyInfo(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }));
  };

  const updateLanguage = (index: number, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      languages: (prev.languages || []).map((lang, i) => i === index ? value : lang)
    }));
  };

  if (loading || !companyInfo) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
        <p className="text-gray-600">Manage your company information and contact details</p>
        
        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <input
                type="text"
                value={companyInfo.businessInfo?.industry || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  businessInfo: { ...(prev.businessInfo || {}), industry: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                value={companyInfo.yearsExperience}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <input
                type="number"
                value={companyInfo.businessInfo?.establishedYear || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  businessInfo: { ...(prev.businessInfo || {}), establishedYear: parseInt(e.target.value) || new Date().getFullYear() }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={1000}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Email *
              </label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email *
              </label>
              <input
                type="email"
                value={companyInfo.supportEmail}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website *
              </label>
              <input
                type="url"
                value={companyInfo.businessInfo?.website || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  businessInfo: { ...(prev.businessInfo || {}), website: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <input
                type="text"
                value={companyInfo.timeZone}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, timeZone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Numbers *
            </label>
            {Array.isArray(companyInfo.phone) ? companyInfo.phone.map((phone, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 XXXXXXXXXX"
                />
                {Array.isArray(companyInfo.phone) && companyInfo.phone.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoneNumber(index)}
                    className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            )) : []}
            <button
              type="button"
              onClick={addPhoneNumber}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Phone Number
            </button>
          </div>

          {/* Additional Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toll Free Number
              </label>
              <input
                type="text"
                value={companyInfo.contactInfo.tollFreeNumber || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, tollFreeNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                value={companyInfo.contactInfo.emergencyContact || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, emergencyContact: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Service
              </label>
              <input
                type="text"
                value={companyInfo.contactInfo.customerService || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, customerService: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Branch Offices */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Offices</h2>
          {(companyInfo.branchOffices || []).length === 0 ? (
            <p className="text-gray-500 mb-4">No branch offices added yet.</p>
          ) : (
            <div className="space-y-4">
              {(companyInfo.branchOffices || []).map((office, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        value={office.name}
                        onChange={(e) => updateBranchOffice(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Branch name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="text"
                        value={office.phone}
                        onChange={(e) => updateBranchOffice(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 XXXXXXXXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={office.email || ''}
                        onChange={(e) => updateBranchOffice(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="branch@company.com"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeBranchOffice(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove Branch
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={office.address}
                      onChange={(e) => updateBranchOffice(index, 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Complete branch address"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addBranchOffice}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Branch Office
          </button>
        </div>

        {/* Head Office Address */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Head Office Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={companyInfo.headOfficeAddress.street}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, street: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={companyInfo.headOfficeAddress.city}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, city: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={companyInfo.headOfficeAddress.state}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, state: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={companyInfo.headOfficeAddress.country}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, country: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={companyInfo.headOfficeAddress.zipCode}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, zipCode: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                value={companyInfo.headOfficeAddress.fullAddress}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  headOfficeAddress: { ...prev.headOfficeAddress, fullAddress: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={companyInfo.socialLinks.facebook || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={companyInfo.socialLinks.twitter || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={companyInfo.socialLinks.instagram || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={companyInfo.socialLinks.linkedin || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={companyInfo.socialLinks.youtube || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/@yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                value={companyInfo.socialLinks.whatsapp || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, whatsapp: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://wa.me/919876543210"
              />
            </div>
          </div>
        </div>

        {/* Company Images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo *
              </label>
              <ImageUpload
                currentImage={companyInfo.logo}
                onImageUploaded={(url) => setCompanyInfo(prev => ({ ...prev, logo: url }))}
                folder="company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <ImageUpload
                currentImage={companyInfo.favicon || ''}
                onImageUploaded={(url) => setCompanyInfo(prev => ({ ...prev, favicon: url }))}
                folder="company"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(companyInfo.workingHours || {}).map(([day, hours]) => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {day}
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setCompanyInfo(prev => ({ 
                    ...prev, 
                    workingHours: { ...prev.workingHours, [day]: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="9:00 AM - 6:00 PM or Closed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mission & Vision</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={companyInfo.missionStatement || ''}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, missionStatement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
                placeholder="Our mission is to..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                value={companyInfo.visionStatement || ''}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, visionStatement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
                placeholder="Our vision is to..."
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Core Values</h2>
          {(companyInfo.coreValues || []).map((value, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) => updateCoreValue(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a core value"
              />
              {(companyInfo.coreValues || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCoreValue(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCoreValue}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Core Value
          </button>
        </div>

        {/* Certifications */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
          {(companyInfo.certifications || []).map((cert, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => updateCertification(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter certification name"
              />
              {(companyInfo.certifications || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Certification
          </button>
        </div>

        {/* Languages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages Supported</h2>
          {(companyInfo.languages || []).map((lang, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={lang}
                onChange={(e) => updateLanguage(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter language"
              />
              {(companyInfo.languages || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLanguage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Language
          </button>
        </div>

        {/* Business Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={companyInfo.businessInfo?.registrationNumber || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  businessInfo: { ...(prev.businessInfo || {}), registrationNumber: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID
              </label>
              <input
                type="text"
                value={companyInfo.businessInfo?.taxId || ''}
                onChange={(e) => setCompanyInfo(prev => ({ 
                  ...prev, 
                  businessInfo: { ...(prev.businessInfo || {}), taxId: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Rating
              </label>
              <select
                value={companyInfo.rating}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Star</option>
                <option value={1.5}>1.5 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={2.5}>2.5 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={3.5}>3.5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={4.5}>4.5 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Company Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsPage;