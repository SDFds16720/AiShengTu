import React from 'react';
import { Layout as AntLayout, Typography } from 'antd';
import './index.css';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className="layout">
      <Header className="header">
        <div className="logo">
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            AI 图片生成工作室
          </Title>
        </div>
      </Header>
      <Content className="content">
        <div className="container">
          {children}
        </div>
      </Content>
      <Footer className="footer">
        AI Image Generation Studio ©{new Date().getFullYear()} Created with ❤️
      </Footer>
    </AntLayout>
  );
};
