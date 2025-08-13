import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompanyInfo extends Document {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  yearsExperience: number;
  rating: number;
  description: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
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
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    default: '+91 8891 209 432'
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
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
  socialLinks: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true }
  },
  workingHours: {
    monday: { type: String, default: '9:00 AM - 6:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
    thursday: { type: String, default: '9:00 AM - 6:00 PM' },
    friday: { type: String, default: '9:00 AM - 6:00 PM' },
    saturday: { type: String, default: '9:00 AM - 1:00 PM' },
    sunday: { type: String, default: 'Closed' }
  }
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