import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import {
  Layout as AppLayout,
  ModelSelector,
  InputArea,
  ResultDisplay,
  HistoryPanel,
  TaskStatusPanel,
} from './components';
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    // Check if Electron API is loaded
    console.log('[App] Checking Electron API...');
    console.log('[App] window.electronAPI:', window.electronAPI);
    console.log('[App] Available methods:', window.electronAPI ? Object.keys(window.electronAPI) : 'N/A');

    if (!window.electronAPI) {
      console.error('[App] ⚠️ Electron API not loaded! Make sure you are running with "npm run electron:dev"');
    } else {
      console.log('[App] ✅ Electron API loaded successfully');
    }
  }, []);

  return (
    <AppLayout>
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <ModelSelector />
          <InputArea />
          <ResultDisplay />
        </Col>
        <Col xs={24} lg={8}>
          <TaskStatusPanel />
          <HistoryPanel />
        </Col>
      </Row>
    </AppLayout>
  );
};

export default App;
