import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStatistics extends Document {
  _id: string;
  projectsCount: number;
  graduationsCount: number;
  certificationsCount: number;
  countriesCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statisticsSchema = new Schema<IStatistics>({
  projectsCount: {
    type: Number,
    required: [true, 'Projects count is required'],
    min: [0, 'Projects count cannot be negative'],
    default: 0
  },
  graduationsCount: {
    type: Number,
    required: [true, 'Graduations count is required'],
    min: [0, 'Graduations count cannot be negative'],
    default: 0
  },
  certificationsCount: {
    type: Number,
    required: [true, 'Certifications count is required'],
    min: [0, 'Certifications count cannot be negative'],
    default: 0
  },
  countriesCount: {
    type: Number,
    required: [true, 'Countries count is required'],
    min: [0, 'Countries count cannot be negative'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

let Statistics: Model<IStatistics>;

try {
  Statistics = mongoose.model<IStatistics>('Statistics');
} catch {
  Statistics = mongoose.model<IStatistics>('Statistics', statisticsSchema);
}

export default Statistics;