// models/BlogPost.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [200, 'Excerpt cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['inspection', 'equipment', 'safety', 'training', 'industry-news', 'case-studies']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  readTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogPostSchema.index({ category: 1, status: 1, publishedAt: -1 });

// Fix: Explicitly define the model to avoid TypeScript issues
let BlogPost;

if (mongoose.models.BlogPost) {
  BlogPost = mongoose.models.BlogPost;
} else {
  BlogPost = mongoose.model('BlogPost', blogPostSchema);
}

export default BlogPost;