import React from 'react';
import { Form, Input, Button, Typography, Layout, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style.scss';
import { Link, useHistory } from 'react-router-dom';
import { _signUp } from './Api';

const { Title } = Typography;
const { Item } = Form;

function SignUp() {
  const [form] = Form.useForm();
  let history = useHistory();
  const onFinish = values => {
    _signUp(values, form, history);
  };

  function compareToFirstPassword(rule, value) {
    if (value && value !== form.getFieldValue('password')) {
      return Promise.reject('Two passwords that you enter is inconsistent!');
    } else {
      return Promise.resolve();
    }
  }
  return (
    <Layout className="auth">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
      >
        <Title style={{ textAlign: 'center' }}>Sign Up</Title>
        <Item
          hasFeedback
          name="username"
          rules={[
            {
              required: true,
              min: 3,
              max: 15,
            },
            {
              pattern: new RegExp('^[a-z0-9]*$'),
              message:
                'Username can only consist of english lowercase letters and numbers',
            },
          ]}
        >
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Item>

        <Item hasFeedback name="role" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="2">Owner</Radio>
            <Radio value="3">Customer</Radio>
          </Radio.Group>
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

        <Item
          name="password_confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
            },
            {
              validator: compareToFirstPassword,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm password"
          />
        </Item>
        <Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign up
          </Button>
          Or <Link to="/signin">Sign in!</Link>
        </Item>
      </Form>
    </Layout>
  );
}

export default SignUp;
