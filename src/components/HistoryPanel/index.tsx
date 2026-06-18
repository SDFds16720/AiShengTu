import React from 'react';
import { Card, List, Image, Button, Empty, Popconfirm } from 'antd';
import { DeleteOutlined, DownloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHistoryStore } from '@/store';
import { ImageService } from '@/services/ImageService';
import { message } from 'antd';
import './index.css';

export const HistoryPanel: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useHistoryStore();

  const handleDownload = async (imageUrl: string, model: string, prompt?: string) => {
    try {
      const filename = ImageService.generateFilename(model, prompt);
      await ImageService.downloadImage(imageUrl, filename);
      message.success('图片下载成功');
    } catch (error) {
      message.error('图片下载失败');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <Card className="history-panel-card" title="历史记录">
        <Empty
          description="暂无历史记录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      className="history-panel-card"
      title={`历史记录 (${history.length}条)`}
      extra={
        <Popconfirm
          title="确定清空所有历史记录吗？"
          onConfirm={clearHistory}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger>
            清空全部
          </Button>
        </Popconfirm>
      }
    >
      <List
        className="history-list"
        itemLayout="vertical"
        dataSource={history}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(item.imageUrl, item.config.model, item.config.prompt)}
              >
                下载
              </Button>,
              <Popconfirm
                title="确定删除此记录吗？"
                onConfirm={() => removeFromHistory(item.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Image
                  src={item.imageUrl}
                  width={100}
                  height={100}
                  style={{ borderRadius: 8 }}
                  preview={false}
                />
              }
              title={item.config.prompt || '无描述'}
              description={
                <div className="history-meta">
                  <span>
                    <ClockCircleOutlined /> {formatDate(item.timestamp)}
                  </span>
                  <span>模型: {item.config.model}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
