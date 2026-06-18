import React from 'react';
import { Card, Image, Empty, Button, Space, message } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useImageStore } from '@/store';
import { ImageService } from '@/services/ImageService';
import './index.css';

export const ResultDisplay: React.FC = () => {
  const { generatedImages, clearGeneratedImages } = useImageStore();

  const handleDownload = async (imageUrl: string, model: string, prompt?: string) => {
    try {
      const filename = ImageService.generateFilename(model, prompt);
      await ImageService.downloadImage(imageUrl, filename);
      message.success('图片下载成功');
    } catch (error) {
      message.error('图片下载失败');
      console.error('Download error:', error);
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
