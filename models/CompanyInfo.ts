import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompanyInfo extends Document {
  _id: string;
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
  branchOffices?: {
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
  coreValues?: string[];
  certifications?: string[];
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
  businessInfo: {
    registrationNumber?: string;
    taxId?: string;
    establishedYear?: number;
    industry: string;
    website: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const companyInfoSchema = new Schema<ICompanyInfo>({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    default: 'Inspec Bull International'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    default: 'info@inspecbull.com'
  },
  supportEmail: {
    type: String,
    required: [true, 'Support email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid support email'],
    default: 'support@inspecbull.com'
  },
  phone: [{
    type: String,
    required: true,
    trim: true
  }],
  headOfficeAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    zipCode: { type: String, required: true, trim: true },
    fullAddress: { type: String, required: true, trim: true }
  },
  branchOffices: [{
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true }
  }],
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  favicon: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    default: 10
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 5
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  missionStatement: {
    type: String,
    trim: true,
    maxlength: [500, 'Mission statement cannot exceed 500 characters']
  },
  visionStatement: {
    type: String,
    trim: true,
    maxlength: [500, 'Vision statement cannot exceed 500 characters']
  },
  coreValues: [{
    type: String,
    trim: true
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true },
    youtube: { type: String, trim: true },
    whatsapp: { type: String, trim: true }
  },
  contactInfo: {
    tollFreeNumber: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    customerService: { type: String, trim: true }
  },
  businessInfo: {
    registrationNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    establishedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    industry: { type: String, required: true, default: 'Non-Destructive Testing' },
    website: { type: String, required: true, default: 'https://inspecbull.com' }
  },
  workingHours: {
    monday: { type: String, default: '9:00 AM - 6:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
    thursday: { type: String, default: '9:00 AM - 6:00 PM' },
    friday: { type: String, default: '9:00 AM - 6:00 PM' },
    saturday: { type: String, default: '9:00 AM - 1:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  timeZone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  languages: [{
    type: String,
    default: ['English', 'Hindi']
  }]
}, {
  timestamps: true
});

let CompanyInfo: Model<ICompanyInfo>;

try {
  CompanyInfo = mongoose.model<ICompanyInfo>('CompanyInfo');
} catch {
  CompanyInfo = mongoose.model<ICompanyInfo>('CompanyInfo', companyInfoSchema);
}

export default CompanyInfo;