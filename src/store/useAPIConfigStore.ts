import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface APIConfig {
  provider: 'openai' | 'volcano';
  apiKey: string;
  baseUrl?: string;
  enabled: boolean;
}

interface AppConfig {
  autoSaveEnabled: boolean;
  autoSavePath: string;
}

interface APIConfigState {
  configs: Record<string, APIConfig>;
  appConfig: AppConfig;

  setConfig: (provider: string, config: Partial<APIConfig>) => void;
  getConfig: (provider: string) => APIConfig | undefined;
  removeConfig: (provider: string) => void;
  enableProvider: (provider: string, enabled: boolean) => void;
  setAppConfig: (config: Partial<AppConfig>) => void;
}

const DEFAULT_CONFIGS: Record<string, APIConfig> = {
  openai: {
    provider: 'openai',
    apiKey: '',
    baseUrl: 'https://www.cctq.ai/v1',
    enabled: false,
  },
  volcano: {
    provider: 'volcano',
    apiKey: '',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    enabled: false,
  },
};

const DEFAULT_APP_CONFIG: AppConfig = {
  autoSaveEnabled: false,
  autoSavePath: '',
};

export const useAPIConfigStore = create<APIConfigState>()(
  persist(
    (set, get) => ({
      configs: DEFAULT_CONFIGS,
      appConfig: DEFAULT_APP_CONFIG,

      setConfig: (provider, config) => {
        set((state) => ({
          configs: {
            ...state.configs,
            [provider]: {
              ...state.configs[provider],
              ...config,
            },
          },
        }));
      },

      getConfig: (provider) => {
        return get().configs[provider];
      },

      removeConfig: (provider) => {
        set((state) => {
          const { [provider]: _, ...rest } = state.configs;
          return {
            configs: rest,
          };
        });
      },

      enableProvider: (provider, enabled) => {
        set((state) => ({
          configs: {
            ...state.configs,
            [provider]: {
              ...state.configs[provider],
              enabled,
            },
          },
        }));
      },

      setAppConfig: (config) => {
        set((state) => ({
          appConfig: {
            ...state.appConfig,
            ...config,
          },
        }));
      },
    }),
    {
      name: 'api-config-storage',
    }
  )
);
