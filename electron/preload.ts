import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveImage: (defaultName: string) => ipcRenderer.invoke('save-image', defaultName),
  saveBase64Image: (base64Data: string, defaultName: string) =>
    ipcRenderer.invoke('save-base64-image', base64Data, defaultName),
  saveImageAuto: (base64Data: string, savePath: string, filename: string) =>
    ipcRenderer.invoke('save-image-auto', base64Data, savePath, filename),
  selectImage: () => ipcRenderer.invoke('select-image'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  downloadImage: (url: string) => ipcRenderer.invoke('download-image', url),
  onMainProcessMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, message) => callback(message))
  }
})
