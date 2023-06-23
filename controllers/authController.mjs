import { promisify } from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import AppError from '../utils/appError.mjs';
import sendEmail from '../utils/email.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import User from '../models/userModel.mjs';

// Sign function by jwt
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    // Here the time for the cookie is set, DELETE cookie after expired
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true, // Cookie only send by e encrypted connection, for example HTTPS
    httpOnly: true, //Prevent Cross-Site Scripting (XSS) attacks, can not be destroyed, to delete it or log out, in this way, only the cookie can be overwritten, but without token + new cookie has very short survival time
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove the password from the output, because when user is created, you still see the pw in it
  user.password = undefined;

  res.status(statusCode).json({
    // 201 for created
    status: 'success',
    token, // (token bevor user-data)
    data: {
      user: user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  // Like createUser, but in authentication- controller, 201 for created

  console.log('bin signup: ');
  console.log(req.body);

  // To create a user, only this will be accepted
  const newUser = await User.create({
    employeeNumber: req.body.employeeNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    gender: req.body.gender,
    language: req.body.language,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
    photo: req.body.photo,
    department: req.body.department,
  });

  // JWT- token generate, sign(payload, secret, expiration time)
  createSendToken(newUser, 201, res);
});

// Authentication and Authorisation (authentication with JWT- webtoken)
export const login = catchAsync(async (req, res, next) => {
  const { employeeNumber, password } = req.body;
  const employeeNumberAsNumber = Number(employeeNumber);

  //1. check if employee- number and password exist
  if (!employeeNumber || !password) {
    return next(
      new AppError('Please provide employee-number and password!', 400) // 400 = bad request
    );
  }

  //2. check if user exists && password is correct
  const user = await User.findOne({
    employeeNumber: employeeNumberAsNumber,
  }).select('+password');
  console.log('user in db  gefunden: ' + user);
  console.log('user.password: ' + user.password);
  console.log('password: ' + password);

  // When separate, if(!user) and if(!!(await user.correctPassword(password, user.password))) a hacker have the information, if employee- number or password is incorrect, correctPassword is true or false
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401 unauthorized
  }

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  // Must have exactly the same name because the old cookie will be overwritten, and the new one has only short lifetime
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000), // 1*1000 = 1 second
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

// Middleware- function for protected route, (for these routes you have to be logged in)
export const protect = catchAsync(async (req, res, next) => {
  console.log('bin protect in authController');

  // 1.) Getting token and checking if exist
  let token;

  // In Header.authorization, check if there is a hashed token (Bearer)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // check if token exist
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    ); // 401 unauthorized
  }

  //2.) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //callback, decoded payload von jwt, id by user
  //console.log("decoded Payload jwt: " + JSON.stringify(decoded)) // JSONwebTokenError means, the webtoken was changed, e.g. at www.jwt.io error comes, e.g. instead of mongodb, comes from jwt libary

  //3.) Check if user still exist     wenn zb token gestohlen und user pw wechselt//
  const currentUser = await User.findById(decoded.id).populate('machinery');

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4.) Check if user change password after the token was issued // Inaktiv
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    //iat = issuesAt
    return next(
      new AppError('User recently changed password! Please log in again!', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // Here the user, with all his details restored / bounded
  res.locals.user = currentUser; // Here the user, with all his details restored / bounded, but for rendering sites
  next();
});

// Same like protect- middleware, but only for rendered pages, no creating errors!
// here it has no catchasync, because an error on logout is sent to the apperror by another cookie, although there is no apperror in here, because not catch async errors
export const isLoggedIn = async (req, res, next) => {
  console.log('bin isLoggedIn in authController');

  if (req.cookies.jwt) {
    try {
      //1.) Verifytoken, looks if the cookie have a token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //2.) Check if user still exist, for example the token is stolen or the user changes his password
      const currentUser = await User.findById(decoded.id).populate('machinery');

      if (!currentUser) {
        return next();
      }

      //3.) Check if user change password after the token was issued // Inactive
      if (currentUser.changesPasswordAfter(decoded.iat)) {
        //iat = issuesAt
        return next();
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser; // Here the user is restored / bounded
      res.locals.user = currentUser; // Here the user is restored / bounded, but for rendering sites
      return next(); // Here it has a cookie, must have a return, because without return, then it will be next, and this next has no cookie
    } catch (err) {
      return next(); // THERE IS A LOGGED IN USER, cookie has NO token
    }
  }
  next(); // Here, there is no logged in user, because has no cookie
};

// Authorization, for example, so that a user has rights, as soon as he is logged in, e.g. to delete something in the db
// RestrictTo, this middleware run after the protect- middleware (--> req.user)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403) // 403 = forbidden
      );
    }
    next();
  };
};

// Inactivate
export const forgotPassword = catchAsync(async (req, res, next) => {
  console.log('bin forgotPassword in authController');
  // 1.) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email adress', 404)); // 404 = not found
  }

  // 2.) Generate the random reset token (NO JWT- Token)
  const resetToken = user.createPasswordResetToken(); // createPasswordResetToken is in userModel (not saved, only modified)
  await user.save({ validateBeforeSave: false }); // save in db, deactivate all validators in schema mongodb

  // 3.) sended back as an email      protokol http or https
  const resetURL = `${req.protokol}://${req.get(
    // protocol...
    'host'
  )}/api/v1/users/resetPassword/${resetToken}}`; // stored in res.protokol

  const message = `Forgot your Password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf
    you didn' t forget your password, please ignore this email!`;

  //send email
  try {
    await sendEmail({
      email: user.email, // or req.body.email is the same
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!', // Reset-token can not be send by a email, but a email is a save place, wehre only the user has access
    });
  } catch (err) {
    //reset token and reset user properties
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined; // this modified the data, but not save!
    await user.save({ validateBeforeSave: false }); // save in db, deactivate all validators in schema mongoDB

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    ); // 500 = error happen on server
  }
});

// Inactivate
export const resetPassword = catchAsync(async (req, res, next) => {
  console.log('bin resetPassword in AuthController');
  // 1.) Get user based on the token
  // Token send in url is not encrypted token, the one we have in the db is the encrypted one
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token) // Because in url by userRoute is resetToken/:token -> req.param.token
    .digest('hex');

  // Token is in this moment the only thing, you know about user, so token comes from db
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Consider expiration date
  });

  // 2.) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or is expired', 400)); //400=bad request
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined; // not save, is only a modified document

  await user.save(); // save in db  (with validations)

  // 3.) Update changedPasswordAT property for the user

  // 4.) Log the user in, send JWT

  createSendToken(user, 200, res);
});

// Only for logged in Users
export const updatePassword = catchAsync(async (req, res, next) => {
  console.log('bin updatePassword in authController');
  // 1.) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  console.log('user: ' + user);
  console.log('user.password: ' + user.password);
  console.log('req.body.passwordCurrent: ' + req.body.passwordCurrent);

  // 2.) Check if POSTed current password is correct
  const isCorrectPassword = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );
  console.log('isCorrectPassword: ' + isCorrectPassword);

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401)); // 401 = unauthorized
  }

  // 3.) if so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Have to be validated (not with await user.findByIdAndUpdate()! because in the usermodel validator only work with save, pre- save middleware also not work)

  // 4.) log user in, send JWT
  createSendToken(user, 200, res);
});
