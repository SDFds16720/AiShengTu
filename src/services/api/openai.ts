import axios from 'axios';
import { BaseImageAPI } from './base';
import { ImageGenerationConfig, GenerationResult, ModelInfo } from '@/types';

const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export class OpenAIAPI extends BaseImageAPI {
  private apiKey: string;
  private client;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: OPENAI_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  getName(): string {
    return 'OpenAI';
  }

  async generate(config: ImageGenerationConfig): Promise<GenerationResult> {
    try {
      const requestData: Record<string, unknown> = {
        model: config.model,
        prompt: config.prompt,
        n: config.n || 1,
        size: config.size || '1024x1024',
      };

      if (config.quality) requestData.quality = config.quality;
      if (config.style) requestData.style = config.style;

      const response = await this.client.post('/images/generations', requestData);

      return {
        imageUrl: response.data.data[0].url,
        status: 'completed',
        model: config.model,
        prompt: config.prompt,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      return {
        imageUrl: '',
        status: 'failed',
      };
    }
  }

  async getModels(): Promise<ModelInfo[]> {
    return [
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: 'openai',
        description: '最新的DALL-E模型，生成高质量图片',
        type: 'text2img',
        maxSize: '1024x1024',
        supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
      },
      {
        id: 'dall-e-2',
        name: 'DALL-E 2',
        provider: 'openai',
        description: 'DALL-E第二代模型',
        type: 'both',
        maxSize: '1024x1024',
        supportedSizes: ['256x256', '512x512', '1024x1024'],
      },
    ];
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    // OpenAI API 是同步的，不需要检查状态
    return {
      imageUrl: '',
      status: 'completed',
    };
  }
}
