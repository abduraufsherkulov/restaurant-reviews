import { message } from 'antd';
import axios from 'axios';
import { _errorHandler } from '../../helpers/helper';
import { settings } from '../../settings';

export const _getUsers = async ({ auth: { user, dispatch } }) => {
  return await axios({
    method: 'get',
    url: `${settings.url}/users`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      _errorHandler(error.response, dispatch);
      return Promise.reject(error.response.data.message);
    });
};

export const _deleteUser = async ({ user_id, auth: { user, dispatch } }) => {
  return await axios({
    method: 'delete',
    url: `${settings.url}/users/${user_id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return response.data.data;
    })
    .catch(error => {
      _errorHandler(error.response, dispatch);
      return Promise.reject(error.response.data.message);
    });
};

export const _editUser = async ({
  values: { user_id, password },
  auth: { user, dispatch },
}) => {
  return await axios({
    method: 'put',
    url: `${settings.url}/users/${user_id}`,
    data: { password },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return response.data.data;
    })
    .catch(error => {
      _errorHandler(error.response, dispatch);
      return Promise.reject(error.response.data.message);
    });
};
