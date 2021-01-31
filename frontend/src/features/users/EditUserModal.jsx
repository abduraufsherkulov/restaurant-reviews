import React, { useContext, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { editUser } from './userSlice';
import { AuthContext } from '../auth/AuthContext';

const { Item } = Form;

const EditUserModal = ({ isModalVisible, setIsModalVisible, form }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOk = async () => {
    setLoading(true);

    try {
      const values = await form.validateFields();
      await dispatch(editUser({ values, auth }));
      setLoading(false);
      setIsModalVisible(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function compareToFirstPassword(rule, value) {
    if (value && value !== form.getFieldValue('password')) {
      return Promise.reject('Two passwords that you enter is inconsistent!');
    } else {
      return Promise.resolve();
    }
  }

  return (
    <>
      <Modal
        title="Edit a user"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Submit"
      >
        <Form form={form} name="basic">
          <Item
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
            <Input disabled />
          </Item>

          <Item
            name="password"
            rules={[{ required: true, min: 6, max: 15 }]}
            hasFeedback
          >
            <Input.Password placeholder="New password" />
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
            <Input.Password placeholder="Confirm password" />
          </Item>
          <Item name="user_id" hidden={true}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserModal;
