import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAboutUs extends Document {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  missionStatement?: string;
  visionStatement?: string;
  certificationImages: string[];
  companyImages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const aboutUsSchema = new Schema<IAboutUs>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters'],
    default: 'Precision, Reliability, and Excellence in Every Step!'
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  missionStatement: {
    type: String,
    trim: true,
    maxlength: [1000, 'Mission statement cannot exceed 1000 characters']
  },
  visionStatement: {
    type: String,
    trim: true,
    maxlength: [1000, 'Vision statement cannot exceed 1000 characters']
  },
  certificationImages: [{
    type: String,
    trim: true
  }],
  companyImages: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

let AboutUs: Model<IAboutUs>;

try {
  AboutUs = mongoose.model<IAboutUs>('AboutUs');
} catch {
  AboutUs = mongoose.model<IAboutUs>('AboutUs', aboutUsSchema);
}

export default AboutUs;