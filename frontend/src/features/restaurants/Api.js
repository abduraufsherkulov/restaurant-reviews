import axios from 'axios';
import { settings } from '../../settings';
import { message } from 'antd';
import { _errorHandler } from '../../helpers/helper';

export const _addRestaurant = async ({
  auth,
  values: data,
  filterVal,
  pagination,
}) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'post',
    url: `${settings.url}/restaurants/`,
    data,
    params: { filterVal, pagination },
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

export const _deleteRestaurant = async ({
  auth: { user, dispatch },
  restaurant_id,
  filterVal,
  pagination,
}) => {
  return await axios({
    method: 'delete',
    url: `${settings.url}/restaurants/${restaurant_id}`,
    params: { filterVal, pagination },
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

export const _editRestaurant = async ({
  auth: { user, dispatch },
  values: { name, restaurant_id },
}) => {
  return await axios({
    method: 'put',
    url: `${settings.url}/restaurants/${restaurant_id}`,
    data: { name },
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

export const _getRestaurants = async ({
  auth,
  filterVal = 0,
  pagination = 1,
}) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'get',
    url: `${settings.url}/restaurants/`,
    params: { filterVal, pagination },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      _errorHandler(error.response, dispatch);
      return Promise.reject(error.response.data.message);
    });
};

export const _getSingleRestaurant = async ({
  restaurant_id,
  auth,
  history,
}) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'get',
    url: `${settings.url}/restaurants/${restaurant_id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      _errorHandler(error.response, dispatch, history);
      return Promise.reject(error.response.data.message);
    });
};
