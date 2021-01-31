import React, { useContext } from 'react';
import { Form, Input, Button, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './style.scss';
import { _signIn } from './Api';
import { AuthContext } from './AuthContext';

const { Title } = Typography;
const { Item } = Form;

function SignIn() {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  let location = useLocation();
  const [form] = Form.useForm();
  const onFinish = values => {
    _signIn(values, form, history, location, dispatch);
  };
  return (
    <Layout className="auth">
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
      >
        <Title style={{ textAlign: 'center' }}>Sign in</Title>
        <Item
          name="username"
          rules={[
            { required: true, min: 3, max: 15 },
            {
              pattern: new RegExp('^[a-z0-9]*$'),
              message:
                'Username can only consist of english lowercase letters and numbers',
            },
          ]}
          hasFeedback
        >
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Item>
        <Item
          name="password"
          rules={[{ required: true, min: 6, max: 15 }]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Item>

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign In
          </Button>
          Or <Link to="/signup">register now!</Link>
        </Item>
      </Form>
    </Layout>
  );
}

export default SignIn;
