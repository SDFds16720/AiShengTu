import axios from 'axios';
import { BaseImageAPI } from './base';
import { ImageGenerationConfig, GenerationResult, ModelInfo } from '@/types';

const VOLCANO_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

export class VolcanoAPI extends BaseImageAPI {
  private apiKey: string;
  private client;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
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
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: true,
      };

      const response = await this.client.post('/images/generations', requestData);

      // Handle different response formats
      let imageUrl = '';

      if (response.data.data && response.data.data[0]) {
        // Standard OpenAI-like format
        imageUrl = response.data.data[0].url || response.data.data[0].b64_json;
      } else if (response.data.url) {
        // Direct URL format
        imageUrl = response.data.url;
      } else if (response.data.image_url) {
        // Alternative format
        imageUrl = response.data.image_url;
      }

      if (!imageUrl) {
        console.error('Unexpected response format:', response.data);
        throw new Error('API 返回格式异常：未找到图片地址');
      }

      return {
        imageUrl,
        taskId: response.data.task_id || response.data.id,
        status: 'completed',
        model: config.model,
        prompt: config.prompt,
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Volcano generation error:', error);

      let errorMessage = '火山引擎生成失败';

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Throw error with message so it can be caught by caller
      const customError = new Error(errorMessage);
      (customError as any).response = error.response;
      throw customError;
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
