import { useContext, useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteRestaurant } from './restaurantSlice';
import { AuthContext } from '../auth/AuthContext';
import { useQuery } from '../../helpers/helper';
const ConfirmDeleteRestaurant = ({ restaurant_id }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const auth = useContext(AuthContext);
  const query = useQuery();
  const dispatch = useDispatch();

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    await dispatch(
      deleteRestaurant({
        restaurant_id,
        auth,
        pagination: query.get('page'),
        filterVal: query.get('rating'),
      })
    );
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Popconfirm
        title="Are you sure you want to delete this restaurant and its content?"
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
export default ConfirmDeleteRestaurant;
