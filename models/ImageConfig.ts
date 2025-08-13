import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IImageConfig extends Document {
  _id: string;
  category: string;
  label: string;
  description?: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  mobileVersion?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  maxFileSize: number; // in MB
  allowedFormats: string[];
  folder: string;
  examples?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const imageConfigSchema = new Schema<IImageConfig>({
  category: {
    type: String,
    required: [true, 'Category is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  label: {
    type: String,
    required: [true, 'Label is required'],
    trim: true,
    maxlength: [100, 'Label cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  dimensions: {
    width: {
      type: Number,
      required: [true, 'Width is required'],
      min: [1, 'Width must be positive']
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [1, 'Height must be positive']
    },
    aspectRatio: {
      type: String,
      required: [true, 'Aspect ratio is required']
    }
  },
  mobileVersion: {
    width: {
      type: Number,
      min: [1, 'Mobile width must be positive']
    },
    height: {
      type: Number,
      min: [1, 'Mobile height must be positive']
    },
    aspectRatio: {
      type: String
    }
  },
  maxFileSize: {
    type: Number,
    required: [true, 'Max file size is required'],
    min: [0.1, 'Max file size must be at least 0.1 MB'],
    max: [50, 'Max file size cannot exceed 50 MB'],
    default: 5
  },
  allowedFormats: [{
    type: String,
    enum: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    lowercase: true
  }],
  folder: {
    type: String,
    required: [true, 'Folder is required'],
    trim: true
  },
  examples: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

imageConfigSchema.index({ category: 1 });

let ImageConfig: Model<IImageConfig>;

try {
  ImageConfig = mongoose.model<IImageConfig>('ImageConfig');
} catch {
  ImageConfig = mongoose.model<IImageConfig>('ImageConfig', imageConfigSchema);
}

export default ImageConfig;