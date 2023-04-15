import AppError from '../utils/appError.mjs';

const handleCastErrorDB = (err) => {
  console.log('Bin handleCastErrorDB');
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  console.log('Bin handleDuplicateFieldsDB');
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  console.log('Bin handleValidationErrorDB');
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  console.log('9999999999999999999999999999999999999999999999');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message + 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

//module.exports = (err, req, res, next) => {
export default (err, req, res, next) => {
  console.log('**************************************** ' + err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('bin errorController.mjs und im develop');
    // sendErrorDev(err, res);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message + ' bin errorHandling-Middleware bei app.js',
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    // let error = {...err };

    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError')
    //     error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

//************************************************************************************************
// const AppError = require("../utils/appError");

// // zum testen get one Tour http://127.0.0.1:4301/api/v1/tours/123456789121
// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400); // 400 = bad request
// }

// //zum testen:  post create tour "The forrest Hiker"     run in production
// const handleDublicateFieldsDB = err => {
//     const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     console.log("value err.errmsg: " + value)
//     const message = `Dublicate field value: x. Please use another value`;
//     return new AppError(message, 400);
// }

// //video 121
// const handleValidationErrorDB = err => { // loop über alle Errors in DB
//     const errors = Object.values(err.errors).map(el => el.message)
//     const message = `Invalid input-data. ${errors.join('. ')}`;
//     return new AppError(message, 400);
// }

// const sendErrorDev = (err, res) => {
//     res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message + ' bin sendErrorDev, bin errorHandling-Middleware bei app.js',
//         stack: err.stack
//     });
// }

// const sendErrorProd = (err, res) => {
//     // operational, trustet error: send message to client
//     if (err.isOperational) { // nur wenn fehler operationFehler ist
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message + 'bin sendErrorProd, ist operation - Error bin errorHandling-Middleware bei app.js',
//         });

//         // Programming or other unknown error: don't leak error details
//     } else {
//         // 1.) log error
//         console.error('ERROR', err);

//         // 2.) send generic message
//         res.status(500).json({
//             status: 'error',
//             message: 'Something went very wrong!'
//         })
//     }

// }

// module.exports = (err, req, res, next) => {

//     // stackTrace
//     //console.log("err.stack(Trace): " + err.stack);

//     //default error-status-code
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     if (process.env.NODE_ENV === 'development') {
//         sendErrorDev(err, res);
//     } else if (process.env.NODE_ENV === 'production') {
//         // fehler von MongoDB aber oprerational errors
//         // mache copie von err
//         let error = {...err };

//         if (error.name === 'CastError') error = handleCastErrorDB(error);
//         if (error.code === 11000) error = handleDublicateFieldsDB(error);
//         if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

//         sendErrorProd(error, res);
//     }

// }

//------------------------------------------------------------
// module.exports = (err, req, res, next) => {

//     // stackTrace
//     //console.log("err.stack(Trace): " + err.stack);

//     //default error-status-code
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     if (process.env.NODE_ENV === 'development') {
//         res.status(err.statusCode).json({
//             status: err.status,
//             error: err,
//             message: err.message + ' bin errorHandling-Middleware bei app.js',
//             stack: err.stack
//         });
//     } else if (process.env.NODE_ENV === 'production') {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message + ' bin errorHandling-Middleware bei app.js',
//         });
//     }

// }
