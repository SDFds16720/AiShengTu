import axios from 'axios';
import { BaseImageAPI } from './base';
import { ImageGenerationConfig, GenerationResult, ModelInfo } from '@/types';

const VOLCANO_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

export class VolcanoAPI extends BaseImageAPI {
  private apiKey: string;
  private accessKey: string;
  private client;

  constructor(apiKey: string, accessKey: string) {
    super();
    this.apiKey = apiKey;
    this.accessKey = accessKey;
    this.client = axios.create({
      baseURL: VOLCANO_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  getName(): string {
    return '火山引擎';
  }

  async generate(config: ImageGenerationConfig): Promise<GenerationResult> {
    try {
      const requestData = {
        model: config.model,
        prompt: config.prompt,
        size: config.size || '1024x1024',
      };

      const response = await this.client.post('/images/generations', requestData);

      return {
        imageUrl: response.data.data[0].url,
        taskId: response.data.task_id,
        status: response.data.status || 'completed',
        model: config.model,
        prompt: config.prompt,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Volcano generation error:', error);
      return {
        imageUrl: '',
        status: 'failed',
      };
    }
  }

  async getModels(): Promise<ModelInfo[]> {
    return [
      {
        id: 'volcano-general-v1',
        name: '通用文生图模型 v1',
        provider: 'volcano',
        description: '火山引擎通用文生图模型',
        type: 'text2img',
        maxSize: '1024x1024',
        supportedSizes: ['512x512', '1024x1024', '2048x2048'],
      },
      {
        id: 'volcano-img2img-v1',
        name: '图生图模型 v1',
        provider: 'volcano',
        description: '火山引擎图生图模型',
        type: 'img2img',
        maxSize: '1024x1024',
        supportedSizes: ['512x512', '1024x1024'],
      },
    ];
  }

  async checkStatus(taskId: string): Promise<GenerationResult> {
    try {
      const response = await this.client.get(`/tasks/${taskId}`);
      return {
        imageUrl: response.data.image_url,
        taskId: taskId,
        status: response.data.status,
        createdAt: response.data.created_at,
      };
    } catch (error) {
      console.error('Volcano status check error:', error);
      return {
        imageUrl: '',
        status: 'failed',
      };
    }
  }
}
