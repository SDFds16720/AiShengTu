import React, { useState } from 'react';
import { Card, Input, Button, Space, Row, Col, message, Select } from 'antd';
import { SendOutlined, ClearOutlined } from '@ant-design/icons';
import { useImageStore, useModelStore, useTaskStore } from '@/store';
import { ImageUploader } from '../ImageUploader';
import { GenerationService } from '@/services/GenerationService';
import { ALL_MODELS } from '@/config/models';
import './index.css';

const { TextArea } = Input;
const { Option } = Select;

export const InputArea: React.FC = () => {
  const {
    prompt,
    inputImage,
    setPrompt,
    isGenerating,
    setGenerating,
    addGeneratedImage,
  } = useImageStore();
  const { selectedModel } = useModelStore();
  const addTask = useTaskStore((state) => state.addTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const [generationType, setGenerationType] = useState<'text2img' | 'img2img'>('text2img');
  const [selectedSize, setSelectedSize] = useState<string>('1024x1024');

  const selectedModelConfig = ALL_MODELS.find(m => m.id === selectedModel);
  const supportedSizes = selectedModelConfig?.supportedSizes || ['1024x1024'];

  const handleGenerate = async () => {
    if (!selectedModel) {
      message.warning('请先选择生成模型');
      return;
    }

    if (!prompt && !inputImage) {
      message.warning('请输入文字描述或上传图片');
      return;
    }

    if (generationType === 'img2img' && !inputImage) {
      message.warning('图生图模式需要上传参考图片');
      return;
    }

    // Start generating
    setGenerating(true);

    // Create a new task
    const taskId = addTask({
      status: 'generating',
      prompt: prompt,
      model: selectedModel,
    });

    message.loading({ content: '正在调用 API 生成图片...', key: 'generating' });

    try {
      // Call real API with type and size
      const result = await GenerationService.generateAndDownload(
        prompt,
        selectedModel,
        {
          type: generationType,
          size: selectedSize,
          inputImage: inputImage?.preview,
        }
      );

      // Add generated image to results
      addGeneratedImage({
        imageUrl: result.imageUrl,
        model: selectedModel,
        prompt: prompt,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      updateTaskStatus(taskId, 'success');
      message.success({ content: '图片生成成功', key: 'generating' });
    } catch (error: any) {
      const errorMessage = error.message || '生成过程出错';
      updateTaskStatus(taskId, 'failed', errorMessage);
      message.error({ content: errorMessage, key: 'generating' });
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
  };

  return (
    <Row gutter={24}>
      <Col xs={24} lg={12}>
        <Card className="input-area-card" title="输入描述">
          {/* Generation Type and Size Selectors */}
          <Space style={{ marginBottom: 16, width: '100%' }} size="middle">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
                生成类型
              </label>
              <Select
                value={generationType}
                onChange={setGenerationType}
                style={{ width: '100%' }}
                disabled={isGenerating}
              >
                <Option value="text2img">文生图</Option>
                <Option value="img2img">图生图</Option>
              </Select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
                图片尺寸
              </label>
              <Select
                value={selectedSize}
                onChange={setSelectedSize}
                style={{ width: '100%' }}
                disabled={isGenerating}
              >
                {supportedSizes.map(size => (
                  <Option key={size} value={size}>{size}</Option>
                ))}
              </Select>
            </div>
          </Space>

          {/* Prompt Input */}
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="请输入图片描述文字，例如：一只可爱的小猫坐在窗台上看着外面的雨景..."
            autoSize={{ minRows: 6, maxRows: 10 }}
            className="prompt-input"
            disabled={isGenerating}
          />

          {/* Action Buttons */}
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
