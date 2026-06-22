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
    description: '火山引擎豆包文生图 5.0 版本，最新版本',
    type: 'text2img',
    maxSize: '2048x2048',
    supportedSizes: ['1024x1024', '1536x1536', '2048x2048'],
  },
  {
    id: 'doubao-seedream-4-5',
    name: 'Doubao-Seedream 4.5',
    provider: 'volcano',
    description: '火山引擎豆包文生图 4.5 版本，平衡质量和速度',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['512x512', '768x768', '1024x1024'],
  },
  {
    id: 'doubao-seedream-4-0',
    name: 'Doubao-Seedream 4.0',
    provider: 'volcano',
    description: '火山引擎豆包文生图 4.0 版本',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['512x512', '768x768', '1024x1024'],
  },
  {
    id: 'doubao-seedream-3-5',
    name: 'Doubao-Seedream 3.5',
    provider: 'volcano',
    description: '火山引擎豆包文生图 3.5 版本，稳定可靠',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['512x512', '768x768', '1024x1024'],
  },
  {
    id: 'high_aes_general_v2.0_L',
    name: '通用文生图 2.0L',
    provider: 'volcano',
    description: '火山引擎通用文生图大模型，高质量输出',
    type: 'text2img',
    maxSize: '2048x2048',
    supportedSizes: ['512x512', '1024x1024', '1536x1536', '2048x2048'],
  },
  {
    id: 'high_aes_general_v2.0_S',
    name: '通用文生图 2.0S',
    provider: 'volcano',
    description: '火山引擎通用文生图小模型，快速生成',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['512x512', '768x768', '1024x1024'],
  },
];

// OpenAI 模型
export const OPENAI_MODELS: ModelConfig[] = [
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'openai',
    description: 'OpenAI最新的DALL-E模型，生成高质量图片',
    type: 'text2img',
    maxSize: '1024x1024',
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
  },
  {
    id: 'dall-e-2',
    name: 'DALL-E 2',
    provider: 'openai',
    description: 'DALL-E第二代模型，支持图生图',
    type: 'both',
    maxSize: '1024x1024',
    supportedSizes: ['256x256', '512x512', '1024x1024'],
  },
];

export const ALL_MODELS: ModelConfig[] = [...VOLCANO_MODELS, ...OPENAI_MODELS];

// 按提供商分组
export const MODELS_BY_PROVIDER = {
  volcano: VOLCANO_MODELS,
  openai: OPENAI_MODELS,
};
