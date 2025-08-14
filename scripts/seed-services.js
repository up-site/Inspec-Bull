const mongoose = require('mongoose');
const Service = require('../models/Service.ts');
require('dotenv').config();

const sampleServices = [
  {
    title: 'NDT Training Courses',
    description: 'Comprehensive NDT training programs covering Ultrasonic Testing (UT), Radiographic Testing (RT), and Magnetic Particle Testing (MPT). Hands-on training designed for professionals across industries.',
    icon: '📚',
    category: 'training',
    images: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop'
    ],
    isActive: true,
    order: 1,
    slug: 'ndt-training-courses'
  },
  {
    title: 'NDT Equipment & Tools',
    description: 'High-quality NDT equipment including ultrasonic testers, radiographic systems, and magnetic test kits. Essential tools for material inspection across various industries.',
    icon: '🔧',
    category: 'equipment',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    ],
    isActive: true,
    order: 2,
    slug: 'ndt-equipment-tools'
  },
  {
    title: 'NDT Career Opportunities',
    description: 'Explore exciting career opportunities in NDT across aerospace, oil & gas, construction, and manufacturing. Join our network of skilled professionals.',
    icon: '💼',
    category: 'jobs',
    images: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    ],
    isActive: true,
    order: 3,
    slug: 'ndt-career-opportunities'
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inspec-bull');
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`Inserted ${services.length} services:`);
    services.forEach(service => {
      console.log(`- ${service.title} (${service.category})`);
    });

    console.log('Services seeded successfully!');
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedServices();