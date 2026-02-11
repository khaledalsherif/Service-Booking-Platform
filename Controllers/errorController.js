const AppError = require('../Utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or unknown error: don't leak error details . (Generic message error)
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong!',
    });
  }
};
//401 Unauthorized
const handleJsonWebTokenError = () =>
  new AppError('Invalid token, Please logged in again!', 401);

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err); //let error = Object.create(err);
    //JsonWebTokenError
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    sendErrorProd(error, res);
  }
  next();
};
