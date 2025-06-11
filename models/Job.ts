import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: String,
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'submitted'
  },
  notes: String,
  interviewDate: Date,
  feedback: String
}, {
  timestamps: true
});

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    website: String,
    description: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    }
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  requirements: [String],
  responsibilities: [String],
  qualifications: [String],
  benefits: [String],
  category: {
    type: String,
    required: true,
    enum: ['ndt-technician', 'quality-inspector', 'welding-inspector', 'project-manager', 'sales', 'engineering', 'training']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
    required: true
  },
  experience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: null
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: String,
    country: {
      type: String,
      required: true
    },
    remote: {
      type: Boolean,
      default: false
    },
    hybrid: {
      type: Boolean,
      default: false
    }
  },
  skills: [String],
  certifications: [String],
  applicationDeadline: Date,
  startDate: Date,
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  applications: [applicationSchema],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
jobSchema.index({ category: 1, type: 1, status: 1, 'location.country': 1 });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);