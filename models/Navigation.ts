import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INavigation extends Document {
  _id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  hasDropdown: boolean;
  parentId?: mongoose.Types.ObjectId;
  children?: mongoose.Types.ObjectId[];
  target: '_self' | '_blank';
  icon?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const navigationSchema = new Schema<INavigation>({
  label: {
    type: String,
    required: [true, 'Label is required'],
    trim: true,
    maxlength: [50, 'Label cannot exceed 50 characters']
  },
  href: {
    type: String,
    required: [true, 'Href is required'],
    trim: true
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hasDropdown: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Navigation',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Navigation'
  }],
  target: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self'
  },
  icon: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

navigationSchema.index({ order: 1, isActive: 1, parentId: 1 });

let Navigation: Model<INavigation>;

try {
  Navigation = mongoose.model<INavigation>('Navigation');
} catch {
  Navigation = mongoose.model<INavigation>('Navigation', navigationSchema);
}

export default Navigation;