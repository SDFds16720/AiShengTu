/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_VOLCANO_API_KEY: string
  readonly VITE_VOLCANO_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Electron API 类型定义
interface ElectronAPI {
  saveImage: (defaultName: string) => Promise<{ canceled: boolean; filePath?: string }>
  saveBase64Image: (base64Data: string, defaultName: string) => Promise<{ canceled: boolean; filePath?: string }>
  saveImageAuto: (base64Data: string, savePath: string, filename: string) => Promise<{ success: boolean; filePath?: string }>
  selectImage: () => Promise<{ canceled: boolean; filePaths: string[] }>
  selectDirectory: () => Promise<{ canceled: boolean; path?: string }>
  downloadImage: (url: string) => Promise<string>
  onMainProcessMessage: (callback: (message: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
