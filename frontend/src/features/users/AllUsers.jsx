import React, { useContext, useEffect, useState } from 'react';
import { Table, Tag, Space, Form } from 'antd';
import { AuthContext } from '../auth/AuthContext';
import { roles } from '../../settings';
import { EditOutlined } from '@ant-design/icons';
import ConfirmDeleteUser from './ConfirmDeleteUser';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectAllUsers } from './userSlice';
import EditModal from './EditUserModal';
import './style.scss';

const { useForm } = Form;

function AllUsers() {
  const auth = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [form] = useForm();
  useEffect(() => {
    dispatch(fetchUsers({ auth }));
  }, []);

  const passToModal = user => {
    form.setFieldsValue({ username: user.username, user_id: user._id });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: text => <a href="#a">{text}</a>,
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: role => (
        <>
          <Tag color={role === roles.owner ? 'geekblue' : 'green'}>
            {role === roles.owner ? 'Owner' : 'Customer'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => passToModal(record)} />
          <ConfirmDeleteUser user_id={record._id} />
        </Space>
      ),
    },
  ];
  return (
    <div id="all-users">
      <EditModal
        form={form}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <Table rowKey="_id" columns={columns} dataSource={users} />
    </div>
  );
}

export default AllUsers;
