import React, { useEffect } from 'react';
import { Card, Select, Space, Spin, Empty } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useModelStore } from '@/store';
import './index.css';

const { Option } = Select;

export const ModelSelector: React.FC = () => {
  const { models, selectedModel, isLoading, setModel, loadModels } = useModelStore();

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  if (isLoading) {
    return (
      <Card className="model-selector-card">
        <div className="loading-container">
          <Spin tip="加载模型中..." />
        </div>
      </Card>
    );
  }

  if (models.length === 0) {
    return (
      <Card className="model-selector-card">
        <Empty description="暂无可用模型" />
      </Card>
    );
  }

  return (
    <Card className="model-selector-card" title="选择模型">
      <Select
        value={selectedModel}
        onChange={setModel}
        style={{ width: '100%' }}
        placeholder="请选择生成模型"
        size="large"
      >
        {models.map(model => (
          <Option key={model.id} value={model.id}>
            <Space>
              <RobotOutlined />
              <span>{model.name}</span>
              <span className="model-provider">({model.provider})</span>
            </Space>
          </Option>
        ))}
      </Select>
      {selectedModel && (
        <div className="model-info">
          {models.find(m => m.id === selectedModel)?.description}
        </div>
      )}
    </Card>
  );
};
