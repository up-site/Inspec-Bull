import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'pending'],
    default: 'pending'
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['industry-news', 'equipment-updates', 'training', 'job-alerts', 'company-updates']
    }],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  verificationToken: String,
  verifiedAt: Date,
  unsubscribeToken: String,
  unsubscribedAt: Date,
  source: {
    type: String,
    enum: ['website', 'blog', 'social-media', 'event'],
    default: 'website'
  },
  tags: [String]
}, {
  timestamps: true
});

newsletterSchema.index({ email: 1, status: 1 });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);