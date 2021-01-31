import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Rate } from 'antd';
import { useDispatch } from 'react-redux';
import { editReview } from './reviewSlice';
import { AuthContext } from '../auth/AuthContext';

const { Item } = Form;

const EditReviewModal = ({ isModalVisible, setIsModalVisible, form }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOk = async () => {
    setLoading(true);

    try {
      const values = await form.validateFields();
      await dispatch(editReview({ values, auth }));
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
        title="Edit a review"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Submit"
        forceRender
      >
        <Form form={form} name="basic">
          <Item
            rules={[{ required: true, message: 'Please rate' }]}
            name="rating"
          >
            <Rate style={{ color: '#ffa41c' }} />
          </Item>
          <Item
            name="comment"
            rules={[{ required: true, message: 'Please provide your review' }]}
          >
            <Input.TextArea rows={4} />
          </Item>
          <Item name="review_id" hidden={true}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditReviewModal;
