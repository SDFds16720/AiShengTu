import React from 'react';
import { Card, Image, Empty, Button, Space, message } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useImageStore } from '@/store';
import { useAPIConfigStore } from '@/store/useAPIConfigStore';
import { ImageService } from '@/services/ImageService';
import { saveAs } from 'file-saver';
import './index.css';

export const ResultDisplay: React.FC = () => {
  const { generatedImages, clearGeneratedImages } = useImageStore();
  const { appConfig } = useAPIConfigStore();

  const handleDownload = async (imageUrl: string, model: string, prompt?: string) => {
    try {
      const filename = ImageService.generateFilename(model, prompt);

      // Ensure we have a Data URL
      let dataUrl = imageUrl;

      // If it's not already a Data URL, download it first
      if (!imageUrl.startsWith('data:')) {
        if (typeof window !== 'undefined' && (window as any).electronAPI?.downloadImage) {
          console.log('[ResultDisplay] Downloading image via IPC...');
          dataUrl = await (window as any).electronAPI.downloadImage(imageUrl);
          console.log('[ResultDisplay] Image downloaded successfully');
        } else {
          message.error('Electron API 未加载，请使用 Electron 应用打开');
          return;
        }
      }

      // Check if auto-save is enabled
      if (appConfig.autoSaveEnabled && appConfig.autoSavePath && (window as any).electronAPI?.saveImageAuto) {
        console.log('[ResultDisplay] Auto-saving to:', appConfig.autoSavePath);

        try {
          const result = await (window as any).electronAPI.saveImageAuto(
            dataUrl,
            appConfig.autoSavePath,
            filename
          );

          if (result.success) {
            message.success(`图片已自动保存到: ${result.filePath}`);
            return;
          }
        } catch (autoSaveError) {
          console.error('[ResultDisplay] Auto save failed, falling back to dialog:', autoSaveError);
          // If auto-save fails, continue to show dialog
        }
      }

      // Show save dialog if auto-save is disabled or failed
      if (typeof window !== 'undefined' && (window as any).electronAPI?.saveBase64Image) {
        console.log('[ResultDisplay] Using Electron native save dialog');
        const result = await (window as any).electronAPI.saveBase64Image(dataUrl, filename);

        if (result.canceled) {
          console.log('[ResultDisplay] Save canceled by user');
          return;
        }

        message.success(`图片已保存到: ${result.filePath}`);
      } else {
        // Browser fallback
        console.log('[ResultDisplay] Electron API not available, using browser fallback');
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        saveAs(blob, filename);
        message.success('图片保存成功');
      }
    } catch (error) {
      console.error('[ResultDisplay] Download error:', error);
      message.error('图片保存失败');
    }
  };

  const handleClearAll = () => {
    clearGeneratedImages();
    message.success('已清空所有图片');
  };

  if (generatedImages.length === 0) {
    return (
      <Card className="result-display-card" title="生成结果">
        <Empty
          description="暂无生成图片"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      className="result-display-card"
      title={`生成结果 (${generatedImages.length}张)`}
      extra={
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleClearAll}
        >
          清空所有
        </Button>
      }
    >
      <div className="image-grid">
        {generatedImages.map((img, index) => (
          <div key={index} className="image-item">
            <Image
              src={img.imageUrl}
              alt={`Generated ${index + 1}`}
              className="generated-image"
              placeholder
            />
            <div className="image-overlay">
              <Space>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(img.imageUrl, img.model || 'unknown', img.prompt)}
                  size="small"
                >
                  保存
                </Button>
              </Space>
            </div>
            {img.prompt && (
              <div className="image-prompt">
                {img.prompt.slice(0, 50)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
