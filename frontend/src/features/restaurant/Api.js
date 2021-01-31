import axios from 'axios';
import { settings } from '../../settings';
import { message } from 'antd';
import { _errorHandler } from '../../helpers/helper';

export const _getReviews = async ({ auth, restaurant_id }) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'get',
    url: `${settings.url}/reviews/`,
    params: { restaurant_id },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      return { restaurant_id, data: response.data };
    })
    .catch(error => {
      _errorHandler(error.response, dispatch);
      return Promise.reject(error.response.data.message);
    });
};

export const _addReview = async ({
  auth,
  values: data,
  restaurant_id,
  message,
}) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'post',
    url: `${settings.url}/reviews/`,
    data: { ...data },
    params: { restaurant_id },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return {
        reviews: response.data.data.reviews,
        restaurant: response.data.data.restaurant,
      };
    })
    .catch(error => {
      _errorHandler(error.response, dispatch, message);
      return Promise.reject(error.response.data.message);
    });
};

export const _deleteReview = async ({ auth, review_id }) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'delete',
    url: `${settings.url}/reviews/${review_id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return {
        review: response.data.data.review,
        restaurant: response.data.data.restaurant,
      };
    })
    .catch(error => {
      _errorHandler(error.response, dispatch, message);
      return Promise.reject(error.response.data.message);
    });
};

export const _editReview = async ({
  auth: { user, dispatch },
  values: { comment, rating, review_id },
}) => {
  return await axios({
    method: 'put',
    url: `${settings.url}/reviews/${review_id}`,
    data: { comment, rating },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return {
        review: response.data.data.review,
        restaurant: response.data.data.restaurant,
      };
    })
    .catch(error => {
      _errorHandler(error.response, dispatch, message);
      return Promise.reject(error.response.data.message);
    });
};
export const _addReply = async ({ auth, message, values, review_id }) => {
  const { user, dispatch } = auth;
  return await axios({
    method: 'post',
    url: `${settings.url}/reviews/reply`,
    data: { ...values },
    params: { review_id },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then(response => {
      message.success(response.data.message);
      return {
        review: response.data.data.review,
        restaurant: response.data.data.restaurant,
      };
    })
    .catch(error => {
      _errorHandler(error.response, dispatch, message);
      return Promise.reject(error.response.data.message);
    });
};
