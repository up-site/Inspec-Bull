const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Navigation Schema (recreated for seed script)
const navigationSchema = new mongoose.Schema({
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

const Navigation = mongoose.models.Navigation || mongoose.model('Navigation', navigationSchema);

const seedNavigation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inspec-bull');
    console.log('Connected to MongoDB');

    // Check if banner navigation already exists
    const existingBanner = await Navigation.findOne({ href: '/admin/banners' });
    
    if (existingBanner) {
      console.log('Banner navigation already exists!');
      console.log('Label:', existingBanner.label);
      console.log('Href:', existingBanner.href);
      process.exit(0);
    }

    // Create admin navigation items
    const adminNavItems = [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        order: 1,
        isActive: true,
        hasDropdown: false,
        target: '_self',
        icon: 'dashboard',
        description: 'Admin dashboard overview'
      },
      {
        label: 'Content Management',
        href: '/admin/content',
        order: 2,
        isActive: true,
        hasDropdown: true,
        target: '_self',
        icon: 'content',
        description: 'Manage website content'
      }
    ];

    // Create parent items first
    const createdParents = await Navigation.insertMany(adminNavItems);
    const contentManagementId = createdParents.find(item => item.label === 'Content Management')._id;

    // Create child items for Content Management
    const contentChildren = [
      {
        label: 'Banners',
        href: '/admin/banners',
        order: 1,
        isActive: true,
        hasDropdown: false,
        parentId: contentManagementId,
        target: '_self',
        icon: 'banner',
        description: 'Manage website banners'
      },
      {
        label: 'Blog Posts',
        href: '/admin/blog',
        order: 2,
        isActive: true,
        hasDropdown: false,
        parentId: contentManagementId,
        target: '_self',
        icon: 'blog',
        description: 'Manage blog posts'
      },
      {
        label: 'Courses',
        href: '/admin/courses',
        order: 3,
        isActive: true,
        hasDropdown: false,
        parentId: contentManagementId,
        target: '_self',
        icon: 'course',
        description: 'Manage courses'
      }
    ];

    const createdChildren = await Navigation.insertMany(contentChildren);
    
    // Update parent with children IDs
    await Navigation.findByIdAndUpdate(contentManagementId, {
      children: createdChildren.map(child => child._id)
    });

    console.log('✅ Navigation items created successfully!');
    console.log('📊 Dashboard: /admin/dashboard');
    console.log('📁 Content Management: /admin/content');
    console.log('  └── 🎯 Banners: /admin/banners');
    console.log('  └── 📝 Blog: /admin/blog');
    console.log('  └── 📚 Courses: /admin/courses');
    
  } catch (error) {
    console.error('Error creating navigation items:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedNavigation();