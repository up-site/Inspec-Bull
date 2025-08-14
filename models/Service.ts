import mongoose from 'mongoose';

const servicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  duration: String,
  features: [String]
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['inspection', 'testing', 'certification', 'training', 'consulting', 'equipment', 'jobs', 'equipment-rental']
  },
  serviceType: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid', 'laboratory'],
    required: false
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  features: [String],
  benefits: [String],
  process: [{
    step: Number,
    title: String,
    description: String
  }],
  packages: [servicePackageSchema],
  pricing: {
    startingPrice: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    pricingModel: {
      type: String,
      enum: ['fixed', 'hourly', 'project-based', 'custom'],
      default: 'custom'
    }
  },
  duration: {
    estimated: String,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months']
    }
  },
  requirements: [String],
  deliverables: [String],
  industries: [String],
  certifications: [String],
  team: [{
    role: String,
    experience: String,
    certifications: [String]
  }],
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],
  images: [String],
  icon: String,
  link: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  testimonials: [{
    client: String,
    company: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    project: String,
    date: Date
  }],
  caseStudies: [{
    title: String,
    client: String,
    challenge: String,
    solution: String,
    results: String,
    images: [String],
    document: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    locations: [String],
    schedule: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ category: 1, serviceType: 1, 'availability.status': 1 });

// Clear cached model if it exists to ensure schema changes take effect
if (mongoose.models.Service) {
  delete mongoose.models.Service;
}

export default mongoose.model('Service', serviceSchema);
