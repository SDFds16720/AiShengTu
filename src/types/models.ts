export interface ModelInfo {
  id: string;
  name: string;
  provider: 'openai' | 'volcano' | 'custom';
  icon?: string;
  description?: string;
  type: 'text2img' | 'img2img' | 'both';
  maxSize?: string;
  supportedSizes?: string[];
}

export interface ModelConfig {
  selectedModel: string | null;
  models: ModelInfo[];
  isLoading: boolean;
}
