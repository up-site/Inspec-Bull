import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPageBanner extends Document {
  _id: string;
  page: string;
  title: string;
  subtitle?: string;
  backgroundImage: string;
  overlayOpacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pageBannerSchema = new Schema<IPageBanner>({
  page: {
    type: String,
    required: [true, 'Page identifier is required'],
    unique: true,
    trim: true,
    enum: ['blog', 'services', 'about', 'contact', 'courses']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  backgroundImage: {
    type: String,
    required: [true, 'Background image is required']
  },
  overlayOpacity: {
    type: Number,
    default: 0.4,
    min: 0,
    max: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

pageBannerSchema.index({ page: 1, isActive: 1 });

let PageBanner: Model<IPageBanner>;

try {
  PageBanner = mongoose.model<IPageBanner>('PageBanner');
} catch {
  PageBanner = mongoose.model<IPageBanner>('PageBanner', pageBannerSchema);
}

export default PageBanner;