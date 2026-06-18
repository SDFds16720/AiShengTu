import React, { useCallback } from 'react';
import { Card, Upload, message, Image } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { useImageStore } from '@/store';
import { ImageService } from '@/services/ImageService';
import type { UploadFile } from 'antd/es/upload/interface';
import './index.css';

const { Dragger } = Upload;

export const ImageUploader: React.FC = () => {
  const { inputImage, setInputImage } = useImageStore();

  const handleBeforeUpload = useCallback((file: File) => {
    const validation = ImageService.validateImageFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }

    const preview = URL.createObjectURL(file);
    setInputImage({ file, preview });
    return false;
  }, [setInputImage]);

  const handleRemove = useCallback(() => {
    if (inputImage) {
      URL.revokeObjectURL(inputImage.preview);
      setInputImage(null);
    }
  }, [inputImage, setInputImage]);

  if (inputImage) {
    return (
      <Card className="image-uploader-card" title="已上传图片">
        <div className="preview-container">
          <Image
            src={inputImage.preview}
            alt="Preview"
            className="preview-image"
          />
          <div className="image-actions">
            <span>{inputImage.file.name}</span>
            <DeleteOutlined
              className="delete-icon"
              onClick={handleRemove}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="image-uploader-card" title="上传图片（可选）">
      <Dragger
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        accept="image/*"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽图片到此区域</p>
        <p className="ant-upload-hint">
          支持 JPG、PNG、GIF、WEBP 格式，最大 10MB
        </p>
      </Dragger>
    </Card>
  );
};
