import { BaseImageAPI } from './base';
import { OpenAIAPI } from './openai';
import { VolcanoAPI } from './volcano';

export type APIProvider = 'openai' | 'volcano' | 'custom';

export class APIFactory {
  private static instances: Map<string, BaseImageAPI> = new Map();

  static createAPI(
    provider: APIProvider,
    config?: { apiKey?: string; accessKey?: string }
  ): BaseImageAPI {
    const key = `${provider}-${config?.apiKey || 'default'}`;

    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    let api: BaseImageAPI;

    switch (provider) {
      case 'openai':
        if (!config?.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        api = new OpenAIAPI(config.apiKey);
        break;

      case 'volcano':
        if (!config?.apiKey || !config?.accessKey) {
          throw new Error('Volcano API key and Access key are required');
        }
        api = new VolcanoAPI(config.apiKey, config.accessKey);
        break;

      case 'custom':
        throw new Error('Custom API provider not implemented');

      default:
        throw new Error(`Unsupported API provider: ${provider}`);
    }

    this.instances.set(key, api);
    return api;
  }

  static getAvailableProviders(): APIProvider[] {
    return ['openai', 'volcano'];
  }
}

export * from './base';
export * from './openai';
export * from './volcano';
