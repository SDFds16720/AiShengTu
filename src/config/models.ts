export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'volcano';
  description?: string;
  type: 'text2img' | 'img2img' | 'both';
  maxSize?: string;
  supportedSizes?: string[];
  apiEndpoint?: string;
  defaultParameters?: Record<string, unknown>;
}

// 火山引擎 Doubao-Seedream 系列模型
export const VOLCANO_MODELS: ModelConfig[] = [
  {
    id: 'doubao-seedream-5-0-260128',
    name: 'Doubao-Seedream 5.0',
    provider: 'volcano',
    description: '火山引擎豆包文生图 5.0 版本，最新版本，高质量',
    type: 'text2img',
    maxSize: '2048x2048',
    supportedSizes: ['1024x1024', '1536x1536', '2048x2048'],
  },
  {
    id: 'doubao-seedream-4-5-251128',
    name: 'Doubao-Seedream 4.5',
    provider: 'volcano',
    description: '火山引擎豆包文生图 4.5 版本，平衡质量和速度',
    type: 'text2img',
    maxSize: '2048x2048',
    supportedSizes: ['1024x1024', '1536x1536', '2048x2048'],
  },
];

// OpenAI 模型（使用中转站）
export const OPENAI_MODELS: ModelConfig[] = [
  {
    id: 'gpt-image-2',
    name: 'GPT Image 2',
    provider: 'openai',
    description: 'GPT Image 2 模型，高质量图片生成',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['512x512', '1024x1024', '1792x1024', '1024x1792'],
  },
];

export const ALL_MODELS: ModelConfig[] = [...VOLCANO_MODELS, ...OPENAI_MODELS];

// 按提供商分组
export const MODELS_BY_PROVIDER = {
  volcano: VOLCANO_MODELS,
  openai: OPENAI_MODELS,
};
