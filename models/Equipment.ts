import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: String
});

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ultrasonic', 'radiographic', 'magnetic-particle', 'dye-penetrant', 'eddy-current', 'visual', 'leak-testing', 'thermographic']
  },
  type: {
    type: String,
    enum: ['portable', 'stationary', 'handheld', 'automated'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  specifications: [specificationSchema],
  features: [String],
  applications: [String],
  industries: [String],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    title: String,
    type: {
      type: String,
      enum: ['manual', 'datasheet', 'brochure', 'certificate']
    },
    url: String,
    size: String
  }],
  pricing: {
    salePrice: Number,
    rentalPrice: {
      daily: Number,
      weekly: Number,
      monthly: Number
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'out-of-stock', 'discontinued', 'pre-order'],
      default: 'available'
    },
    quantity: {
      type: Number,
      default: 0
    },
    location: String
  },
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceInterval: Number, // in days
    calibrationDate: Date,
    calibrationInterval: Number // in days
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
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    title: String,
    comment: String,
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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

equipmentSchema.index({ name: 'text', description: 'text', manufacturer: 'text' });
equipmentSchema.index({ category: 1, type: 1, 'availability.status': 1 });

export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
