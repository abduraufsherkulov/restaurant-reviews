import React, { useContext, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { editRestaurant } from './restaurantSlice';
import { AuthContext } from '../auth/AuthContext';

const { Item } = Form;

const EditRestaurantModal = ({ isModalVisible, setIsModalVisible, form }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOk = async () => {
    setLoading(true);

    try {
      const values = await form.validateFields();
      await dispatch(editRestaurant({ values, auth }));
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
  return (
    <>
      <Modal
        title="Edit a restaurant"
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
                max: 15,
              },
              {
                message:
                  'Restaurant name can only consist of english letters and numbers',
                pattern: new RegExp('^[A-Za-z0-9 ]*$'),
              },
            ]}
          >
            <Input />
          </Item>
          <Item name="restaurant_id" hidden={true}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditRestaurantModal;
