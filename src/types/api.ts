export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  upload_preset: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  progress: number; // 0-100
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}