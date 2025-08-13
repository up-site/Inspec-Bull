import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFAQ extends Document {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [300, 'Question cannot exceed 300 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters'],
    default: 'General'
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

faqSchema.index({ order: 1, isActive: 1 });
faqSchema.index({ category: 1 });

let FAQ: Model<IFAQ>;

try {
  FAQ = mongoose.model<IFAQ>('FAQ');
} catch {
  FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
}

export default FAQ;