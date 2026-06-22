import { OpenAIAPI } from './api/openai';
import { VolcanoAPI } from './api/volcano';
import { useAPIConfigStore } from '@/store/useAPIConfigStore';
import { useModelStore } from '@/store/useModelStore';
import { ALL_MODELS } from '@/config/models';
import type { GenerationResult, ImageGenerationConfig } from '@/types';
import axios from 'axios';

export class GenerationService {
  static async generateImage(
    prompt: string,
    model?: string
  ): Promise<GenerationResult> {
    const selectedModel = model || useModelStore.getState().selectedModel;

    if (!selectedModel) {
      throw new Error('请先选择生成模型');
    }

    // Find model config to determine provider
    const modelConfig = ALL_MODELS.find(m => m.id === selectedModel);

    if (!modelConfig) {
      throw new Error(`模型 ${selectedModel} 不存在`);
    }

    const provider = modelConfig.provider;
    const configs = useAPIConfigStore.getState().configs;
    const config = configs[provider];

    console.log('Generation config:', {
      selectedModel,
      provider,
      configEnabled: config?.enabled,
      hasApiKey: !!config?.apiKey,
    });

    if (!config || !config.enabled) {
      throw new Error(`${provider === 'volcano' ? '火山引擎' : 'OpenAI'} API 未启用，请在设置中配置并启用`);
    }

    if (!config.apiKey) {
      throw new Error(`${provider === 'volcano' ? '火山引擎' : 'OpenAI'} API Key 未配置`);
    }

    const generationConfig: ImageGenerationConfig = {
      model: selectedModel,
      prompt,
      size: '1024x1024',
      n: 1,
    };

    try {
      let result: GenerationResult;

      if (provider === 'openai') {
        const api = new OpenAIAPI(config.apiKey);
        if (config.baseUrl) {
          // Update base URL if custom
          (api as any).client.defaults.baseURL = config.baseUrl;
        }
        result = await api.generate(generationConfig);
      } else {
        const api = new VolcanoAPI(config.apiKey);
        if (config.baseUrl) {
          (api as any).client.defaults.baseURL = config.baseUrl;
        }
        result = await api.generate(generationConfig);
      }

      console.log('Generation result:', result);

      if (result.status === 'failed' || !result.imageUrl) {
        throw new Error('生成失败：未返回图片地址');
      }

      return result;
    } catch (error: any) {
      console.error('Generation error:', error);

      // Extract error message from API response
      let errorMessage = '生成失败';

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  static async downloadImageToApp(
    imageUrl: string,
    _filename: string
  ): Promise<string> {
    try {
      console.log('Starting image download:', imageUrl);

      // In Electron environment, use IPC to download image (bypass CORS)
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        console.log('Using Electron IPC to download image');
        try {
          const dataUrl = await (window as any).electronAPI.downloadImage(imageUrl);
          console.log('Image downloaded successfully via IPC, length:', dataUrl?.length);
          return dataUrl;
        } catch (ipcError) {
          console.error('IPC download failed:', ipcError);
          throw ipcError;
        }
      }

      // Fallback: In browser environment, try direct download (may fail due to CORS)
      console.log('Using axios to download image');
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      // Convert to base64 for display
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;

      console.log('Image downloaded via axios, length:', dataUrl.length);
      return dataUrl;
    } catch (error: any) {
      console.error('Download error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.status,
      });
      throw new Error(`下载图片失败: ${error.message}`);
    }
  }

  static async generateAndDownload(
    prompt: string,
    model?: string
  ): Promise<GenerationResult> {
    console.log('[GenerationService] Starting generateAndDownload');

    // Generate image
    const result = await this.generateImage(prompt, model);
    console.log('[GenerationService] Generation result:', {
      imageUrl: result.imageUrl,
      status: result.status,
    });

    if (!result.imageUrl) {
      throw new Error('未获取到图片地址');
    }

    // Try to download image to app
    try {
      const localUrl = await this.downloadImageToApp(
        result.imageUrl,
        `generated-${Date.now()}.png`
      );

      console.log('[GenerationService] Image downloaded successfully');

      return {
        ...result,
        imageUrl: localUrl, // Use local URL for display
      };
    } catch (downloadError) {
      console.error('[GenerationService] Download failed, using original URL:', downloadError);

      // If download fails, return the original URL
      // The user can still view/download the image
      return {
        ...result,
        imageUrl: result.imageUrl, // Keep original URL
      };
    }
  }
}
