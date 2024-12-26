export interface UploadResult {
  url: string;
  success: boolean;
  error?: string;
}

export interface ImageCompression {
  maxSize: number;
  quality: number;
  type: string;
}