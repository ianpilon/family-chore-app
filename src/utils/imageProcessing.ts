/**
 * Utility functions for image processing
 */

/**
 * Creates a canvas with the video frame and handles mirroring
 */
export async function captureVideoFrame(video: HTMLVideoElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Mirror the image for selfie view
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  return canvas;
}

/**
 * Converts canvas to blob with error handling
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        type,
        quality
      );
    } catch (error) {
      reject(new Error('Failed to process image'));
    }
  });
}

/**
 * Compresses an image blob to a target size
 */
export async function compressImage(blob: Blob, maxSizeKB = 500): Promise<Blob> {
  let quality = 0.8;
  let result = blob;
  
  while (result.size > maxSizeKB * 1024 && quality > 0.1) {
    const canvas = await createImageCanvas(result);
    result = await canvasToBlob(canvas, 'image/jpeg', quality);
    quality -= 0.1;
  }
  
  return result;
}

async function createImageCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  const img = new Image();
  const url = URL.createObjectURL(blob);
  
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    ctx.drawImage(img, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}