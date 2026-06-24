import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Switch,
  Tabs,
  Button,
  message,
  Divider,
  Alert,
  Space,
} from 'antd';
import { SettingOutlined, KeyOutlined, ApiOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useAPIConfigStore } from '@/store/useAPIConfigStore';
import './index.css';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { configs, setConfig, appConfig, setAppConfig } = useAPIConfigStore();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('openai');

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Save general settings
      setAppConfig({
        autoSaveEnabled: values.autoSaveEnabled,
        autoSavePath: values.autoSavePath,
      });

      // Save provider settings
      const provider = activeTab;
      if (provider !== 'general') {
        setConfig(provider, {
          apiKey: values[`${provider}_apiKey`],
          baseUrl: values[`${provider}_baseUrl`],
          enabled: values[`${provider}_enabled`],
        });
      }

      message.success('配置保存成功');
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('请检查配置项是否填写正确');
    }
  };

  const renderOpenAIConfig = () => {
    return (
      <div className="config-section">
        <Alert
          message="OpenAI API 配置"
          description="配置 OpenAI API 密钥以使用 GPT Image 2 模型（使用中转站）"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item label="启用 OpenAI" name="openai_enabled" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item
          label="API Key"
          name="openai_apiKey"
          rules={[{ required: true, message: '请输入 OpenAI API Key' }]}
        >
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="输入 API Key"
          />
        </Form.Item>

        <Form.Item label="API Base URL" name="openai_baseUrl">
          <Input prefix={<ApiOutlined />} placeholder="https://www.cctq.ai/v1" />
        </Form.Item>
      </div>
    );
  };

  const renderVolcanoConfig = () => {
    return (
      <div className="config-section">
        <Alert
          message="火山引擎 API 配置"
          description="配置火山引擎 API 密钥以使用 Doubao-Seedream 系列模型。火山引擎使用 Bearer Token 认证，只需要一个 API Key。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item label="启用火山引擎" name="volcano_enabled" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item
          label="API Key"
          name="volcano_apiKey"
          rules={[{ required: true, message: '请输入火山引擎 API Key' }]}
          extra="从火山引擎控制台获取的 API Key，用于 Bearer Token 认证"
        >
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="输入 API Key"
          />
        </Form.Item>

        <Form.Item label="API Base URL" name="volcano_baseUrl">
          <Input prefix={<ApiOutlined />} placeholder="https://ark.cn-beijing.volces.com/api/v3" />
        </Form.Item>

        <Divider />

        <Alert
          message="可用模型列表"
          description={
            <div>
              <p><strong>Doubao-Seedream 系列：</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>Doubao-Seedream-5.0-lite - 轻量版，速度快</li>
                <li>Doubao-Seedream-4.5 - 平衡质量和速度</li>
                <li>Doubao-Seedream-4.0 - 稳定版本</li>
                <li>Doubao-Seedream-3.5 - 经济实惠</li>
              </ul>
              <p><strong>通用模型：</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>high_aes_general_v2.0_L - 大模型，高质量</li>
                <li>high_aes_general_v2.0_S - 小模型，速度快</li>
              </ul>
            </div>
          }
          type="info"
        />
      </div>
    );
  };

  const renderGeneralConfig = () => {
    const handleSelectDirectory = async () => {
      if (typeof window !== 'undefined' && (window as any).electronAPI?.selectDirectory) {
        try {
          const result = await (window as any).electronAPI.selectDirectory();
          if (!result.canceled && result.path) {
            form.setFieldsValue({ autoSavePath: result.path });
            setAppConfig({ autoSavePath: result.path });
          }
        } catch (error) {
          console.error('Select directory error:', error);
          message.error('选择文件夹失败');
        }
      } else {
        message.warning('请在 Electron 应用中使用此功能');
      }
    };

    return (
      <div className="config-section">
        <Alert
          message="通用设置"
          description="配置图片保存和应用行为"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item
          label="启用自动保存"
          name="autoSaveEnabled"
          valuePropName="checked"
          extra="启用后，生成的图片将自动保存到指定文件夹，无需每次选择保存位置"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item
          label="自动保存路径"
          name="autoSavePath"
          extra="图片将自动保存到此文件夹"
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<FolderOpenOutlined />}
              placeholder="选择保存文件夹"
              readOnly
            />
            <Button type="primary" onClick={handleSelectDirectory}>
              选择文件夹
            </Button>
          </Space.Compact>
        </Form.Item>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          通用设置
        </span>
      ),
      children: renderGeneralConfig(),
    },
    {
      key: 'openai',
      label: (
        <span>
          <SettingOutlined />
          OpenAI
        </span>
      ),
      children: renderOpenAIConfig(),
    },
    {
      key: 'volcano',
      label: (
        <span>
          <SettingOutlined />
          火山引擎
        </span>
      ),
      children: renderVolcanoConfig(),
    },
  ];

  // 初始化表单值
  const initialValues = {
    autoSaveEnabled: appConfig.autoSaveEnabled || false,
    autoSavePath: appConfig.autoSavePath || '',
    openai_apiKey: configs.openai?.apiKey || '',
    openai_baseUrl: configs.openai?.baseUrl || 'https://www.cctq.ai/v1',
    openai_enabled: configs.openai?.enabled || false,
    volcano_apiKey: configs.volcano?.apiKey || '',
    volcano_baseUrl: configs.volcano?.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3',
    volcano_enabled: configs.volcano?.enabled || false,
  };

  return (
    <Modal
      title={
        <span>
          <SettingOutlined style={{ marginRight: 8 }} />
          API 设置
        </span>
      }
      open={open}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          保存配置
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Form>
    </Modal>
  );
};
