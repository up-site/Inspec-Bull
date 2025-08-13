import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  _id: string;
  clientName: string;
  position: string;
  company?: string;
  testimonialText: string;
  profileImage?: string;
  rating: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  testimonialText: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true,
    maxlength: [1000, 'Testimonial text cannot exceed 1000 characters']
  },
  profileImage: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

testimonialSchema.index({ order: 1, isActive: 1 });

let Testimonial: Model<ITestimonial>;

try {
  Testimonial = mongoose.model<ITestimonial>('Testimonial');
} catch {
  Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
}

export default Testimonial;