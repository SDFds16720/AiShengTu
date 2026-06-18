import React from 'react';
import { Card, Input, Button, Space, Row, Col, message } from 'antd';
import { SendOutlined, ClearOutlined } from '@ant-design/icons';
import { useImageStore, useModelStore } from '@/store';
import { ImageUploader } from '../ImageUploader';
import './index.css';

const { TextArea } = Input;

export const InputArea: React.FC = () => {
  const { prompt, inputImage, setPrompt, isGenerating } = useImageStore();
  const { selectedModel } = useModelStore();

  const handleGenerate = async () => {
    if (!selectedModel) {
      message.warning('请先选择生成模型');
      return;
    }

    if (!prompt && !inputImage) {
      message.warning('请输入文字描述或上传图片');
      return;
    }

    // TODO: Implement generation logic
    message.success('开始生成图片...');
  };

  const handleClear = () => {
    setPrompt('');
  };

  return (
    <Row gutter={24}>
      <Col xs={24} lg={12}>
        <Card className="input-area-card" title="输入描述">
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="请输入图片描述文字，例如：一只可爱的小猫坐在窗台上看着外面的雨景..."
            autoSize={{ minRows: 6, maxRows: 10 }}
            className="prompt-input"
            disabled={isGenerating}
          />
          <Space className="action-buttons" size="middle">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleGenerate}
              loading={isGenerating}
              size="large"
            >
              生成图片
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              size="large"
            >
              清空
            </Button>
          </Space>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <ImageUploader />
      </Col>
    </Row>
  );
};
