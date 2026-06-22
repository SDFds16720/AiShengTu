import type { GenerationResult } from './api';

export * from './models';
export * from './api';

export interface HistoryItem extends GenerationResult {
  id: string;
  timestamp: number;
  config: {
    prompt?: string;
    model: string;
    size?: string;
  };
}

export interface ImageFile {
  file: File;
  preview: string;
}

export type TaskStatus = 'pending' | 'generating' | 'success' | 'failed';

export interface Task {
  id: string;
  status: TaskStatus;
  prompt?: string;
  model: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}
