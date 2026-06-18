import axios from 'axios';
import { saveAs } from 'file-saver';

export class ImageService {
  static async downloadImage(url: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Failed to download image:', error);
      throw error;
    }
  }

  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  static base64ToBlob(base64: string, type: string = 'image/png'): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  }

  static generateFilename(model: string, prompt?: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const promptPart = prompt ? `-${prompt.slice(0, 20)}` : '';
    return `${model}${promptPart}-${timestamp}.png`;
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: '不支持的图片格式' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: '图片大小不能超过10MB' };
    }

    return { valid: true };
  }
}
