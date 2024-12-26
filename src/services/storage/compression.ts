import { ImageCompression } from './types';

export async function compressImage(
  file: Blob,
  options: ImageCompression
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      let { width, height } = img;
      
      if (width > height && width > options.maxSize) {
        height = (height * options.maxSize) / width;
        width = options.maxSize;
      } else if (height > options.maxSize) {
        width = (width * options.maxSize) / height;
        height = options.maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to compress image')),
        options.type,
        options.quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}