import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CompanyInfo from '../../../../models/CompanyInfo';
import { requireAdmin } from '@/lib/auth';

// GET /api/company-info - Get company information
export async function GET() {
  try {
    await connectToDatabase();
    
    let companyInfo = await CompanyInfo.findOne();
    
    // If no company info exists, create default one
    if (!companyInfo) {
      companyInfo = await CompanyInfo.create({
        companyName: 'Inspec Bull International',
        email: 'info@inspecbull.com',
        supportEmail: 'support@inspecbull.com',
        phone: ['+91 8891 209 432'],
        headOfficeAddress: {
          street: 'Your Street Address',
          city: 'Your City',
          state: 'Your State',
          country: 'India',
          zipCode: '000000',
          fullAddress: 'Your Complete Address Here'
        },
        logo: '/images/logo.png',
        yearsExperience: 10,
        rating: 5,
        description: 'Leading provider of Non-Destructive Testing services',
        businessInfo: {
          industry: 'Non-Destructive Testing',
          website: 'https://inspecbull.com'
        },
        timeZone: 'Asia/Kolkata',
        languages: ['English', 'Hindi']
      });
    }
    
    return NextResponse.json({
      success: true,
      data: companyInfo
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company information' },
      { status: 500 }
    );
  }
}

// PUT /api/company-info - Update company information (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);

    await connectToDatabase();
    
    const body = await request.json();
    const {
      companyName,
      email,
      supportEmail,
      phone,
      headOfficeAddress,
      branchOffices,
      logo,
      favicon,
      yearsExperience,
      rating,
      description,
      missionStatement,
      visionStatement,
      coreValues,
      certifications,
      socialLinks,
      contactInfo,
      businessInfo,
      workingHours,
      timeZone,
      languages
    } = body;

    let companyInfo = await CompanyInfo.findOne();
    
    if (!companyInfo) {
      // Create new company info if doesn't exist
      companyInfo = await CompanyInfo.create(body);
    } else {
      // Update existing company info
      companyInfo = await CompanyInfo.findOneAndUpdate(
        {},
        {
          companyName,
          email,
          supportEmail,
          phone,
          headOfficeAddress,
          branchOffices,
          logo,
          favicon,
          yearsExperience,
          rating,
          description,
          missionStatement,
          visionStatement,
          coreValues,
          certifications,
          socialLinks,
          contactInfo,
          businessInfo,
          workingHours,
          timeZone,
          languages
        },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: companyInfo
    });
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company information' },
      { status: 500 }
    );
  }
}