import { Form, Input, Modal } from 'antd';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '../../helpers/helper';
import { AuthContext } from '../auth/AuthContext';
import { addNewRestaurant } from './restaurantSlice';

const { Item, useForm } = Form;

function AddRestaurant({ isModalVisible, setIsModalVisible }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const query = useQuery();
  const [form] = useForm();
  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await dispatch(
        addNewRestaurant({
          auth,
          values,
          pagination: query.get('page'),
          filterVal: query.get('rating'),
        })
      );
      form.resetFields();
      setIsModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title="Add a restaurant"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Submit"
    >
      <Form form={form} name="basic">
        <Item
          label="Restaurant name"
          name="name"
          rules={[
            {
              required: true,
              min: 3,
              max: 25,
            },
            {
              message:
                'Restaurant name can only consist of english letters and numbers',
              pattern: new RegExp("^[A-Za-z0-9 - ']*$"),
            },
          ]}
        >
          <Input />
        </Item>
      </Form>
    </Modal>
  );
}

export default AddRestaurant;
