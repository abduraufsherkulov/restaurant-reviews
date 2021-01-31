import { message } from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

export const _errorHandler = (error, dispatch, history) => {
  const { status, data } = error;
  switch (status) {
    case 400:
      message.error(data.message);
      break;
    case 401:
      dispatch({ type: 'SIGN_OUT' });
      message.error(data.message);
      break;
    case 403:
      message.error(data.message);
      break;
    case 404:
      history.replace('/notFound');
      break;
    default:
      break;
  }
};

export const momentize = date => {
  return moment(date).format('l');
};

export const validateMessages = {
  required: "'${name}' is required!",

  // ...
};

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const generatePhoto = (manual = false) => {
  if (typeof manual === 'number') {
    return `https://randomuser.me/api/portraits/${
      getRandomInt(1) === 1 ? 'men' : 'women'
    }/${manual}.jpg`;
  } else {
    return `https://randomuser.me/api/portraits/${
      getRandomInt(1) === 1 ? 'men' : 'women'
    }/${getRandomInt(99)}.jpg`;
  }
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
