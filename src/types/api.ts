export interface ImageGenerationConfig {
  prompt?: string;
  image?: File;
  model: string;
  size?: string;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
  type?: 'text2img' | 'img2img';
  inputImage?: string; // Base64 or URL
}

export interface GenerationResult {
  imageUrl: string;
  taskId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: string;
  model?: string;
  prompt?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}
