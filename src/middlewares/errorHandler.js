import { isHttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error) === true) {
    return res.status(error.statusCode).json({
      staus: error.statusCode,
      message: error.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: error.message,
  });
};