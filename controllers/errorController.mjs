import AppError from '../utils/appError.mjs';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again!', 401); // 401 = unauthorized , works only in production

const handleJWTExpiredError = () =>
  new AppError('Your token has been expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // When the url has /api by a error, send JSON...
  if (req.originalUrl.startsWith('/api')) {
    // originalURL, because url not work with the host,

    // A) API
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } //else { // When url not have /api by an error, render page
  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
  //}
};

const sendErrorProd = (err, req, res) => {
  // A) API
  // When the url has /api by a error, send JSON...
  if (req.originalUrl.startsWith('/api')) {
    // originalUrl, because url not with the host
    // aa) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error (from server): don't leak error details
    }
    // bb) 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // because eslint, here no --> else

  // B) RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    console.error('ERROR 💥', err.message);
    return res.status(err.statusCode).render('error', {
      // status
      title: 'Something went wrong!',
      msg: err.message,
    });
  } //else {
  // B) Programming or other unknown error (from server): don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.', //err.message,
  });
  //}
};

export default (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    console.log('Err_PROD: ' + err.message);
    console.log('Error_POD: ' + error.message);
    sendErrorProd(error, req, res);
  }
};
