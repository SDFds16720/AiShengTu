import { create } from 'zustand';
import { ImageFile, GenerationResult } from '@/types';

interface ImageState {
  inputImage: ImageFile | null;
  prompt: string;
  generatedImages: GenerationResult[];
  isGenerating: boolean;

  setInputImage: (image: ImageFile | null) => void;
  setPrompt: (prompt: string) => void;
  addGeneratedImage: (result: GenerationResult) => void;
  setGenerating: (isGenerating: boolean) => void;
  clearGeneratedImages: () => void;
  clearAll: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  inputImage: null,
  prompt: '',
  generatedImages: [],
  isGenerating: false,

  setInputImage: (image) => {
    set({ inputImage: image });
  },

  setPrompt: (prompt) => {
    set({ prompt });
  },

  addGeneratedImage: (result) => {
    set((state) => ({
      generatedImages: [result, ...state.generatedImages],
    }));
  },

  setGenerating: (isGenerating) => {
    set({ isGenerating });
  },

  clearGeneratedImages: () => {
    set({ generatedImages: [] });
  },

  clearAll: () => {
    set({
      inputImage: null,
      prompt: '',
      generatedImages: [],
      isGenerating: false,
    });
  },
}));
