import React, { useContext, useState } from 'react';
import { Menu, Layout, Drawer, Col, Row } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';
import { roles } from '../../settings';
import { _signOut } from '../../features/auth/Api';
import { logOut } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const { Header } = Layout;
const { Item } = Menu;

const LeftMenu = () => {
  const [visible, setVisible] = useState(false);
  const { user, dispatch: dispatcher } = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const handleLogOut = () => {
    _signOut(dispatcher);
    dispatch(logOut());
  };
  return (
    <Header>
      <Row style={{ height: '64px' }} align="middle" justify="space-between">
        <Col>
          <h1>RR</h1>
        </Col>
        <Col>
          <MenuFoldOutlined
            style={{ color: 'white', float: 'right' }}
            onClick={showDrawer}
          />
        </Col>
      </Row>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
          <Item key="/">
            <Link to="/">Restaurants</Link>
          </Item>
          {user.role === roles.admin ? (
            <Item key="/users">
              <Link to="/users">Users</Link>
            </Item>
          ) : null}
          <Item style={{ float: 'right' }} key="4">
            {user.token ? (
              <a href="#none" onClick={handleLogOut}>
                Sign out
              </a>
            ) : (
              <Link to="/signin"> Sign In</Link>
            )}
          </Item>
        </Menu>
      </Drawer>
    </Header>
  );
};

export default LeftMenu;
