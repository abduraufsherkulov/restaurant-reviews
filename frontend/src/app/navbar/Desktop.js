import React, { useContext } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';
import { _signOut } from '../../features/auth/Api';
import { useDispatch } from 'react-redux';
import { logOut } from '../../features/auth/authSlice';
import { roles } from '../../settings';
const { Item } = Menu;

const { Header } = Layout;

const Desktop = () => {
  const { user, dispatch: dispatcher } = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogOut = () => {
    _signOut(dispatcher);
    dispatch(logOut());
  };
  return (
    <Header>
      <div id="header">
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
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
      </div>
    </Header>
  );
};

export default Desktop;
