import { Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

function NotAuthorized() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Link to="/">Back Home</Link>}
    />
  );
}

export default NotAuthorized;
