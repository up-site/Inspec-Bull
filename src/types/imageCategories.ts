export enum ImageCategory {
  BANNER = 'banner',
  MOBILE_BANNER = 'mobile-banner',
  SERVICE = 'service',
  JOB = 'job',
  CLIENT_LOGO = 'client-logo',
  TESTIMONIAL_PHOTO = 'testimonial-photo',
  CERTIFICATION = 'certification',
  COMPANY_PHOTO = 'company-photo',
  BLOG_FEATURED = 'blog-featured',
  COURSE_THUMBNAIL = 'course-thumbnail'
}

export interface ImageCategoryConfig {
  category: ImageCategory;
  label: string;
  description: string;
  icon: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  mobileVersion?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  maxFileSize: number;
  allowedFormats: string[];
  folder: string;
  processingType: 'smart-crop' | 'center-pad' | 'content-aware' | 'face-detect';
}

export const IMAGE_CATEGORY_CONFIGS: Record<ImageCategory, ImageCategoryConfig> = {
  [ImageCategory.BANNER]: {
    category: ImageCategory.BANNER,
    label: 'Hero Banners',
    description: 'Main hero section background images for desktop',
    icon: '🖼️',
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    mobileVersion: { width: 768, height: 1024, aspectRatio: '3:4' },
    maxFileSize: 5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'banners',
    processingType: 'smart-crop'
  },
  [ImageCategory.MOBILE_BANNER]: {
    category: ImageCategory.MOBILE_BANNER,
    label: 'Mobile Banners',
    description: 'Hero section images optimized for mobile devices',
    icon: '📱',
    dimensions: { width: 768, height: 1024, aspectRatio: '3:4' },
    maxFileSize: 3,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'banners/mobile',
    processingType: 'smart-crop'
  },
  [ImageCategory.SERVICE]: {
    category: ImageCategory.SERVICE,
    label: 'Service Images',
    description: 'Images for service cards and detail pages',
    icon: '🛠️',
    dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
    maxFileSize: 2,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'services',
    processingType: 'content-aware'
  },
  [ImageCategory.JOB]: {
    category: ImageCategory.JOB,
    label: 'Job Images',
    description: 'Images for job listings and career pages',
    icon: '💼',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' },
    maxFileSize: 1.5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'jobs',
    processingType: 'content-aware'
  },
  [ImageCategory.CLIENT_LOGO]: {
    category: ImageCategory.CLIENT_LOGO,
    label: 'Client Logos',
    description: 'Company logos with transparent backgrounds',
    icon: '🏢',
    dimensions: { width: 300, height: 150, aspectRatio: '2:1' },
    maxFileSize: 1,
    allowedFormats: ['png', 'svg'],
    folder: 'clients',
    processingType: 'center-pad'
  },
  [ImageCategory.TESTIMONIAL_PHOTO]: {
    category: ImageCategory.TESTIMONIAL_PHOTO,
    label: 'Testimonial Photos',
    description: 'Client profile photos for testimonials',
    icon: '👤',
    dimensions: { width: 200, height: 200, aspectRatio: '1:1' },
    maxFileSize: 1,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    folder: 'testimonials',
    processingType: 'face-detect'
  },
  [ImageCategory.CERTIFICATION]: {
    category: ImageCategory.CERTIFICATION,
    label: 'Certification Images',
    description: 'Certification badges and awards',
    icon: '🏆',
    dimensions: { width: 300, height: 300, aspectRatio: '1:1' },
    maxFileSize: 1,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    folder: 'about-us/certifications',
    processingType: 'center-pad'
  },
  [ImageCategory.COMPANY_PHOTO]: {
    category: ImageCategory.COMPANY_PHOTO,
    label: 'Company Photos',
    description: 'Office, team, and facility photos',
    icon: '🏭',
    dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
    maxFileSize: 3,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'about-us/company',
    processingType: 'content-aware'
  },
  [ImageCategory.BLOG_FEATURED]: {
    category: ImageCategory.BLOG_FEATURED,
    label: 'Blog Featured Images',
    description: 'Main images for blog posts',
    icon: '📝',
    dimensions: { width: 1200, height: 630, aspectRatio: '1.91:1' },
    maxFileSize: 2,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'blog',
    processingType: 'smart-crop'
  },
  [ImageCategory.COURSE_THUMBNAIL]: {
    category: ImageCategory.COURSE_THUMBNAIL,
    label: 'Course Thumbnails',
    description: 'Thumbnail images for courses',
    icon: '📚',
    dimensions: { width: 600, height: 400, aspectRatio: '3:2' },
    maxFileSize: 1.5,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'courses',
    processingType: 'content-aware'
  }
};

export const getAllImageCategories = (): ImageCategoryConfig[] => {
  return Object.values(IMAGE_CATEGORY_CONFIGS);
};

export const getImageCategoryConfig = (category: ImageCategory): ImageCategoryConfig => {
  return IMAGE_CATEGORY_CONFIGS[category];
};