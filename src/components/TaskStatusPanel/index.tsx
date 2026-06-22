import React from 'react';
import { Card, List, Tag, Empty, Button, Popconfirm } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/store/useTaskStore';
import type { Task } from '@/types';
import './index.css';

const getStatusConfig = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return {
        color: '#faad14',
        text: '等待中',
        icon: <ClockCircleOutlined />,
      };
    case 'generating':
      return {
        color: '#faad14',
        text: '生成中',
        icon: <LoadingOutlined spin />,
      };
    case 'success':
      return {
        color: '#52c41a',
        text: '生成成功',
        icon: <CheckCircleOutlined />,
      };
    case 'failed':
      return {
        color: '#ff4d4f',
        text: '生成失败',
        icon: <CloseCircleOutlined />,
      };
    default:
      return {
        color: '#d9d9d9',
        text: '未知状态',
        icon: <ClockCircleOutlined />,
      };
  }
};

export const TaskStatusPanel: React.FC = () => {
  const { tasks, removeTask, clearTasks } = useTaskStore();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (tasks.length === 0) {
    return (
      <Card className="task-status-panel" title="任务状态">
        <Empty
          description="暂无任务"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      className="task-status-panel"
      title={`任务状态 (${tasks.length}个)`}
      extra={
        <Popconfirm
          title="确定清空所有任务吗？"
          onConfirm={clearTasks}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger size="small">
            清空
          </Button>
        </Popconfirm>
      }
    >
      <List
        className="task-list"
        dataSource={tasks}
        renderItem={(task) => {
          const statusConfig = getStatusConfig(task.status);

          return (
            <List.Item
              key={task.id}
              className="task-item"
              actions={[
                <Button
                  key="delete"
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeTask(task.id)}
                />,
              ]}
            >
              <div className="task-content">
                <div className="task-header">
                  <Tag color={statusConfig.color} icon={statusConfig.icon}>
                    {statusConfig.text}
                  </Tag>
                  <span className="task-time">{formatTime(task.createdAt)}</span>
                </div>

                <div className="task-model">模型: {task.model}</div>

                {task.prompt && (
                  <div className="task-prompt">
                    {task.prompt.length > 50
                      ? `${task.prompt.substring(0, 50)}...`
                      : task.prompt}
                  </div>
                )}

                {task.status === 'failed' && task.errorMessage && (
                  <div className="task-error">
                    <CloseCircleOutlined style={{ marginRight: 4 }} />
                    {task.errorMessage}
                  </div>
                )}
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
