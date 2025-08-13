import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBanner extends Document {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    maxlength: [150, 'Subtitle cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  backgroundImage: {
    type: String,
    required: [true, 'Background image is required']
  },
  ctaText: {
    type: String,
    required: [true, 'CTA text is required'],
    trim: true,
    maxlength: [50, 'CTA text cannot exceed 50 characters']
  },
  ctaLink: {
    type: String,
    required: [true, 'CTA link is required'],
    trim: true
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

bannerSchema.index({ order: 1, isActive: 1 });

let Banner: Model<IBanner>;

try {
  Banner = mongoose.model<IBanner>('Banner');
} catch {
  Banner = mongoose.model<IBanner>('Banner', bannerSchema);
}

export default Banner;