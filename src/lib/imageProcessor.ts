import sharp from 'sharp';
import { ImageCategory, getImageCategoryConfig } from '@/types/imageCategories';

export interface ProcessingOptions {
  category: ImageCategory;
  generateMobile?: boolean;
  quality?: number;
}

export interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ProcessingResult {
  desktop: ProcessedImage;
  mobile?: ProcessedImage;
}

export class ImageProcessor {
  private static async detectFaces(buffer: Buffer): Promise<{ x: number; y: number; width: number; height: number }[]> {
    // Simplified face detection - in production, you'd use Google Vision API or similar
    // For now, we'll use center cropping as fallback
    return [];
  }

  private static async smartCrop(
    image: sharp.Sharp,
    targetWidth: number,
    targetHeight: number,
    processingType: string
  ): Promise<sharp.Sharp> {
    const metadata = await image.metadata();
    const originalWidth = metadata.width!;
    const originalHeight = metadata.height!;
    
    const originalRatio = originalWidth / originalHeight;
    const targetRatio = targetWidth / targetHeight;

    switch (processingType) {
      case 'smart-crop':
        return this.smartCropBanner(image, targetWidth, targetHeight, originalRatio, targetRatio);
      
      case 'center-pad':
        return this.centerPad(image, targetWidth, targetHeight);
      
      case 'content-aware':
        return this.contentAwareCrop(image, targetWidth, targetHeight, originalRatio, targetRatio);
      
      case 'face-detect':
        return this.faceDetectCrop(image, targetWidth, targetHeight);
      
      default:
        return this.contentAwareCrop(image, targetWidth, targetHeight, originalRatio, targetRatio);
    }
  }

  private static async smartCropBanner(
    image: sharp.Sharp,
    targetWidth: number,
    targetHeight: number,
    originalRatio: number,
    targetRatio: number
  ): Promise<sharp.Sharp> {
    if (originalRatio > targetRatio) {
      // Image is wider than target - crop width
      const newHeight = Math.round(targetWidth / originalRatio);
      return image
        .resize(targetWidth, newHeight, { fit: 'cover', position: 'center' })
        .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' });
    } else if (originalRatio < targetRatio) {
      // Image is taller than target - create blurred background with proper sizing
      const blurredBackground = image
        .clone()
        .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
        .blur(15);

      // Scale the image to fit within target dimensions while maintaining aspect ratio
      const scaledImage = await image
        .resize(targetWidth, targetHeight, { 
          fit: 'inside',
          withoutEnlargement: false 
        })
        .toBuffer();

      return blurredBackground.composite([{
        input: scaledImage,
        gravity: 'center'
      }]);
    } else {
      // Perfect aspect ratio
      return image.resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' });
    }
  }

  private static async centerPad(
    image: sharp.Sharp,
    targetWidth: number,
    targetHeight: number
  ): Promise<sharp.Sharp> {
    return image
      .resize(targetWidth, targetHeight, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
      });
  }

  private static async contentAwareCrop(
    image: sharp.Sharp,
    targetWidth: number,
    targetHeight: number,
    originalRatio: number,
    targetRatio: number
  ): Promise<sharp.Sharp> {
    // Smart cropping that preserves important content
    if (Math.abs(originalRatio - targetRatio) < 0.1) {
      // Close enough aspect ratios - simple resize
      return image.resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' });
    }

    // Use attention-based cropping (center-weighted)
    return image.resize(targetWidth, targetHeight, { 
      fit: 'cover', 
      position: 'attention' // Sharp's built-in attention algorithm
    });
  }

  private static async faceDetectCrop(
    image: sharp.Sharp,
    targetWidth: number,
    targetHeight: number
  ): Promise<sharp.Sharp> {
    // For now, use center cropping - in production, integrate face detection API
    return image.resize(targetWidth, targetHeight, { 
      fit: 'cover', 
      position: 'center' 
    });
  }

  static async processImage(
    inputBuffer: Buffer,
    originalFilename: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    const config = getImageCategoryConfig(options.category);
    const timestamp = Date.now();
    const fileExt = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
    const baseName = `${timestamp}-${config.category}`;

    // Create sharp instance
    let image = sharp(inputBuffer);
    
    // Process desktop version
    const desktopImage = await this.smartCrop(
      image.clone(),
      config.dimensions.width,
      config.dimensions.height,
      config.processingType
    );

    // Optimize format and quality
    let processedDesktop = desktopImage;
    if (['jpg', 'jpeg'].includes(fileExt)) {
      processedDesktop = processedDesktop.jpeg({ 
        quality: options.quality || 85,
        progressive: true 
      });
    } else if (fileExt === 'png') {
      processedDesktop = processedDesktop.png({ 
        quality: options.quality || 85,
        compressionLevel: 8 
      });
    } else if (fileExt === 'webp') {
      processedDesktop = processedDesktop.webp({ 
        quality: options.quality || 85 
      });
    }

    const desktopBuffer = await processedDesktop.toBuffer();
    const desktopResult: ProcessedImage = {
      buffer: desktopBuffer,
      filename: `${baseName}-desktop.${fileExt}`,
      width: config.dimensions.width,
      height: config.dimensions.height,
      format: fileExt,
      size: desktopBuffer.length
    };

    let mobileResult: ProcessedImage | undefined;

    // Process mobile version if needed
    if (options.generateMobile && config.mobileVersion) {
      const mobileImage = await this.smartCrop(
        image.clone(),
        config.mobileVersion.width,
        config.mobileVersion.height,
        config.processingType
      );

      let processedMobile = mobileImage;
      if (['jpg', 'jpeg'].includes(fileExt)) {
        processedMobile = processedMobile.jpeg({ 
          quality: options.quality || 80,
          progressive: true 
        });
      } else if (fileExt === 'png') {
        processedMobile = processedMobile.png({ 
          quality: options.quality || 80,
          compressionLevel: 8 
        });
      } else if (fileExt === 'webp') {
        processedMobile = processedMobile.webp({ 
          quality: options.quality || 80 
        });
      }

      const mobileBuffer = await processedMobile.toBuffer();
      mobileResult = {
        buffer: mobileBuffer,
        filename: `${baseName}-mobile.${fileExt}`,
        width: config.mobileVersion.width,
        height: config.mobileVersion.height,
        format: fileExt,
        size: mobileBuffer.length
      };
    }

    return {
      desktop: desktopResult,
      mobile: mobileResult
    };
  }

  static async generatePreview(
    inputBuffer: Buffer,
    category: ImageCategory,
    maxPreviewSize: number = 400
  ): Promise<Buffer> {
    const config = getImageCategoryConfig(category);
    
    // Create a preview that maintains aspect ratio but fits within maxPreviewSize
    const targetRatio = config.dimensions.width / config.dimensions.height;
    let previewWidth: number;
    let previewHeight: number;

    if (targetRatio > 1) {
      // Landscape
      previewWidth = Math.min(maxPreviewSize, config.dimensions.width);
      previewHeight = Math.round(previewWidth / targetRatio);
    } else {
      // Portrait or square
      previewHeight = Math.min(maxPreviewSize, config.dimensions.height);
      previewWidth = Math.round(previewHeight * targetRatio);
    }

    const processedImage = await this.smartCrop(
      sharp(inputBuffer),
      previewWidth,
      previewHeight,
      config.processingType
    );

    return processedImage.jpeg({ quality: 75 }).toBuffer();
  }
}