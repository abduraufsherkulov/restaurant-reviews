import { message } from 'antd';
import axios from 'axios';
import { settings } from '../../settings';
import jwt_decode from 'jwt-decode';

// SIGN UP

export const _signUp = (values, form, history) => {
  values.role = +values.role;
  axios({
    method: 'post',
    url: `${settings.url}/auth/signup`,
    data: { ...values },
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      message.success(response.data.message);
      history.push('/signin');
    })
    .catch(error => {
      form.setFields(error.response.data.data);
    });
};

// SIGN IN

export const _signIn = (values, form, history, location, dispatch) => {
  let { from } = location.state || { from: { pathname: '/' } };
  axios({
    method: 'post',
    url: `${settings.url}/auth/signin`,
    data: { ...values },
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      let {
        data: { token },
        message: info,
      } = response.data;
      let { user } = jwt_decode(token);
      user.token = token;
      dispatch({ type: 'SIGN_IN', user });
      history.replace(from);

      message.success(info);
    })
    .catch(error => {
      form.setFields(error.response.data.data);
    });
};

export const _signOut = dispatch => {
  dispatch({ type: 'SIGN_OUT' });
};
