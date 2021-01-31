export const statusCodes = {
  400: {
    message:
      'The server cannot or will not process the request due to an apparent client error!',
  },
  401: { message: 'Either session has expired or you have not logged in yet!' },
  403: { message: 'You are not authorized to perform this action!' },
  404: { message: 'Page not found!' },
};

export const errorHandler = (err, manual = false) => {
  const error = {};

  const arr = [];
  if (!manual) {
    error.message = 'Validation error';
    err.forEach((item) => {
      arr.push(item);
    });
  } else {
    const { errors } = err;
    error.message = err.message;
    Object.keys(errors).forEach((name) =>
      arr.push({ name, errors: [errors[name].message] })
    );
  }

  error.data = arr;
  return error;
};

export const calculateRating = (bulk_rating, count) =>
  Math.round((bulk_rating / count) * 10) / 10;
