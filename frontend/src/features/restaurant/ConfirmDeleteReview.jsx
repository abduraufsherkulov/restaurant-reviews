import { useContext, useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteReview } from './reviewSlice';
import { AuthContext } from '../auth/AuthContext';

const ConfirmDeleteReview = ({ review_id }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await dispatch(deleteReview({ review_id, auth }));
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Popconfirm
        title="Are you sure you want to delete this review?"
        visible={visible}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
      >
        <DeleteOutlined style={{ color: '#1890ff' }} onClick={showPopconfirm} />
      </Popconfirm>
    </>
  );
};
export default ConfirmDeleteReview;
