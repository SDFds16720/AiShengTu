import axios from 'axios';
import { BaseImageAPI } from './base';
import { ImageGenerationConfig, GenerationResult, ModelInfo } from '@/types';

const OPENAI_BASE_URL = 'https://www.cctq.ai/v1';

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
        id: 'gpt-image-2',
        name: 'GPT Image 2',
        provider: 'openai',
        description: 'GPT Image 2 模型，高质量图片生成',
        type: 'text2img',
        maxSize: '1024x1024',
        supportedSizes: ['512x512', '1024x1024', '1792x1024', '1024x1792'],
      },
    ];
  }

  async checkStatus(_taskId: string): Promise<GenerationResult> {
    // OpenAI API 是同步的，不需要检查状态
    return {
      imageUrl: '',
      status: 'completed',
    };
  }
}
