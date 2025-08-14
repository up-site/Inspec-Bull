const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inspec-bull');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Blog schema (simplified version for seeding)
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [String],
  featuredImage: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  publishedAt: { type: Date, default: null },
  readTime: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  role: String
}));

const sampleBlogs = [
  {
    title: 'Advanced Ultrasonic Testing Techniques in 2024',
    excerpt: 'Discover the latest innovations in ultrasonic testing technology and how they\'re revolutionizing NDT practices across industries.',
    content: `Ultrasonic testing (UT) continues to evolve with cutting-edge technology improvements that enhance detection capabilities and reduce inspection time. In 2024, we're seeing remarkable advances in phased array technology, automated scanning systems, and AI-powered defect recognition.

The integration of artificial intelligence in UT equipment has significantly improved flaw detection accuracy while reducing human error. Modern systems can now identify and classify defects with unprecedented precision, making them invaluable in critical applications such as aerospace and nuclear power generation.

Key developments include:
- Enhanced probe technology with improved sensitivity
- Real-time 3D imaging capabilities
- Automated report generation and data analysis
- Integration with IoT systems for remote monitoring

These advancements are making UT more accessible and reliable, ensuring higher safety standards across all industries that rely on non-destructive testing methods.`,
    category: 'equipment',
    tags: ['ultrasonic', 'testing', 'technology', 'innovation'],
    featuredImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
    status: 'published',
    readTime: 3,
    isFeatured: true
  },
  {
    title: 'Safety Protocols for NDT Inspectors: Best Practices Guide',
    excerpt: 'Essential safety guidelines and protocols that every NDT inspector should follow to ensure workplace safety and regulatory compliance.',
    content: `Safety is paramount in non-destructive testing operations. This comprehensive guide outlines the essential safety protocols that every NDT inspector must follow to maintain a safe working environment.

Personal protective equipment (PPE) forms the foundation of NDT safety. Inspectors must wear appropriate gear including safety glasses, protective clothing, and hearing protection when required. Radiation safety is particularly critical when working with radiographic testing methods.

Key safety considerations include:
- Proper handling of radioactive sources
- Electrical safety when using electromagnetic testing equipment
- Chemical safety for penetrant testing materials
- Ergonomic practices to prevent repetitive strain injuries

Regular safety training and certification updates ensure that inspectors stay current with the latest safety standards and regulations. Companies should implement comprehensive safety management systems that include regular audits and continuous improvement processes.

By following these protocols, NDT professionals can maintain the highest safety standards while delivering accurate and reliable inspection results.`,
    category: 'safety',
    tags: ['safety', 'protocols', 'training', 'compliance'],
    featuredImage: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=400&fit=crop',
    status: 'published',
    readTime: 4,
    isFeatured: false
  },
  {
    title: 'NDT Career Opportunities: Growing Demand in 2024',
    excerpt: 'Explore the expanding career opportunities in NDT across various industries and learn about the skills needed for success.',
    content: `The non-destructive testing industry is experiencing unprecedented growth, creating numerous career opportunities for skilled professionals. As infrastructure ages and new technologies emerge, the demand for qualified NDT technicians continues to rise.

Current market trends show strong growth in:
- Aerospace and aviation maintenance
- Oil and gas pipeline inspection
- Renewable energy infrastructure
- Advanced manufacturing quality control

Career paths in NDT offer excellent progression opportunities, from entry-level technician positions to senior inspection roles and management positions. Many professionals also choose to specialize in specific testing methods or industries.

Essential skills for NDT careers include:
- Technical proficiency in multiple testing methods
- Strong attention to detail and analytical thinking
- Understanding of materials science and engineering principles
- Effective communication and documentation skills

Professional certification through organizations like ASNT, PCN, or similar bodies is essential for career advancement. Many employers also value additional qualifications in related fields such as welding inspection or quality management.

The future of NDT careers looks promising, with emerging technologies like automated inspection systems and artificial intelligence creating new opportunities for tech-savvy professionals.`,
    category: 'training',
    tags: ['career', 'jobs', 'opportunities', 'certification'],
    featuredImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
    status: 'published',
    readTime: 5,
    isFeatured: false
  }
];

async function seedBlogs() {
  try {
    await connectDB();

    // Find or create a default admin user for the blog posts
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('Created admin user for blog posts');
    }

    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log('Cleared existing blog posts');

    // Create blog posts with proper data
    const blogPosts = sampleBlogs.map(blog => ({
      ...blog,
      slug: blog.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      author: adminUser._id,
      publishedAt: new Date(),
      views: Math.floor(Math.random() * 100) + 10
    }));

    const createdBlogs = await BlogPost.insertMany(blogPosts);
    console.log(`Created ${createdBlogs.length} blog posts:`);
    createdBlogs.forEach(blog => {
      console.log(`- ${blog.title} (${blog.category})`);
    });

    console.log('Blog seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedBlogs();