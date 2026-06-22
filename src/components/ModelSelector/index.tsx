import React, { useEffect, useState } from 'react';
import { Card, Select, Space, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useModelStore } from '@/store';
import { VOLCANO_MODELS, OPENAI_MODELS, ALL_MODELS } from '@/config/models';
import { SettingsModal } from '../SettingsModal';
import './index.css';

const { Option } = Select;

export const ModelSelector: React.FC = () => {
  const { selectedModel, setModel } = useModelStore();
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    // 设置默认模型
    if (!selectedModel && ALL_MODELS.length > 0) {
      setModel(ALL_MODELS[0].id);
    }
  }, [selectedModel, setModel]);

  const selectedModelInfo = ALL_MODELS.find(m => m.id === selectedModel);

  return (
    <>
      <Card
        className="model-selector-card"
        title="选择模型"
        extra={
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setSettingsVisible(true)}
            title="API设置"
          >
            设置
          </Button>
        }
      >
        <Select
          value={selectedModel}
          onChange={setModel}
          style={{ width: '100%' }}
          placeholder="请选择生成模型"
          size="large"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ minWidth: '500px' }}
          listHeight={300}
        >
          <Select.OptGroup label="🔥 火山引擎 - Doubao-Seedream">
            {VOLCANO_MODELS.map(model => (
              <Option key={model.id} value={model.id}>
                <Space direction="vertical" size={0}>
                  <span>{model.name}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {model.description}
                  </span>
                </Space>
              </Option>
            ))}
          </Select.OptGroup>

          <Select.OptGroup label="🤖 OpenAI - DALL-E">
            {OPENAI_MODELS.map(model => (
              <Option key={model.id} value={model.id}>
                <Space direction="vertical" size={0}>
                  <span>{model.name}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {model.description}
                  </span>
                </Space>
              </Option>
            ))}
          </Select.OptGroup>
        </Select>

        {selectedModelInfo && (
          <div className="model-info">
            <div className="model-info-item">
              <strong>提供商：</strong>
              <span>{selectedModelInfo.provider === 'volcano' ? '火山引擎' : 'OpenAI'}</span>
            </div>
            <div className="model-info-item">
              <strong>类型：</strong>
              <span>
                {selectedModelInfo.type === 'text2img' ? '文生图' :
                 selectedModelInfo.type === 'img2img' ? '图生图' : '文生图 & 图生图'}
              </span>
            </div>
            <div className="model-info-item">
              <strong>最大尺寸：</strong>
              <span>{selectedModelInfo.maxSize}</span>
            </div>
          </div>
        )}
      </Card>

      <SettingsModal
        open={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </>
  );
};
