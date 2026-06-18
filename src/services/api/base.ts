import { ImageGenerationConfig, GenerationResult } from '@/types';

export abstract class BaseImageAPI {
  abstract generate(config: ImageGenerationConfig): Promise<GenerationResult>;
  abstract getModels(): Promise<import('@/types').ModelInfo[]>;
  abstract checkStatus?(taskId: string): Promise<GenerationResult>;
  abstract getName(): string;
}
