import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import Navbar from './app/navbar/Navbar';
import Foot from './app/Foot';

import 'antd/dist/antd.css';
import './styles/styles.scss';
import MainRouter from './MainRouter';
import AuthContextProvider from './features/auth/AuthContext';
import { validateMessages } from './helpers/helper';

const { Content } = Layout;

function App() {
  return (
    <AuthContextProvider>
      <ConfigProvider form={{ validateMessages: validateMessages }}>
        <Router>
          <Layout className="layout">
            <Navbar />
            <div style={{ width: '100%', background: '#fff' }}>
              <Content style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <MainRouter />
              </Content>
            </div>
            <Foot />
          </Layout>
        </Router>
      </ConfigProvider>
    </AuthContextProvider>
  );
}

export default App;
