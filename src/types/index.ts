import { ModelInfo } from './models';
import { GenerationResult } from './api';

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
