import React from 'react';
import { Card, Input, Button, Space, Row, Col, message } from 'antd';
import { SendOutlined, ClearOutlined } from '@ant-design/icons';
import { useImageStore, useModelStore, useTaskStore } from '@/store';
import { ImageUploader } from '../ImageUploader';
import { GenerationService } from '@/services/GenerationService';
import './index.css';

const { TextArea } = Input;

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

  const handleGenerate = async () => {
    if (!selectedModel) {
      message.warning('请先选择生成模型');
      return;
    }

    if (!prompt && !inputImage) {
      message.warning('请输入文字描述或上传图片');
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
      // Call real API
      const result = await GenerationService.generateAndDownload(prompt, selectedModel);

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
