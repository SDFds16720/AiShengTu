import React from 'react';
import { Layout, Row, Col } from 'antd';
import {
  Layout as AppLayout,
  ModelSelector,
  InputArea,
  ResultDisplay,
  HistoryPanel,
} from './components';
import './App.css';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <ModelSelector />
          <InputArea />
          <ResultDisplay />
        </Col>
        <Col xs={24} lg={8}>
          <HistoryPanel />
        </Col>
      </Row>
    </AppLayout>
  );
};

export default App;
