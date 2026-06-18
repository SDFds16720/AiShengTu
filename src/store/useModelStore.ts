import { create } from 'zustand';
import { ModelConfig, ModelInfo } from '@/types';
import { APIFactory } from '@/services/api';

interface ModelState extends ModelConfig {
  setModel: (modelId: string) => void;
  loadModels: () => Promise<void>;
  getSelectedModelInfo: () => ModelInfo | undefined;
}

export const useModelStore = create<ModelState>((set, get) => ({
  selectedModel: null,
  models: [],
  isLoading: false,

  setModel: (modelId: string) => {
    set({ selectedModel: modelId });
  },

  loadModels: async () => {
    set({ isLoading: true });
    try {
      const allModels: ModelInfo[] = [];

      // Load models from available providers
      const providers = APIFactory.getAvailableProviders();

      for (const provider of providers) {
        try {
          // Mock API keys for model loading (actual keys should come from env/config)
          const config = {
            apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'mock-key',
            accessKey: import.meta.env.VITE_VOLCANO_ACCESS_KEY || 'mock-key',
          };
          const api = APIFactory.createAPI(provider, config);
          const models = await api.getModels();
          allModels.push(...models);
        } catch (error) {
          console.error(`Failed to load models from ${provider}:`, error);
        }
      }

      set({ models: allModels, isLoading: false });

      // Set default model if available
      if (allModels.length > 0 && !get().selectedModel) {
        set({ selectedModel: allModels[0].id });
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      set({ isLoading: false });
    }
  },

  getSelectedModelInfo: () => {
    const { selectedModel, models } = get();
    return models.find(m => m.id === selectedModel);
  },
}));
