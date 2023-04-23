// const Tour = require('../models/tourModel')
// const User = require('../models/userModel')
// const AppError = require('../utils/appError')
// const catchAsync = require('../utils/catchAsync')

import Tour from '../models/tourModel.mjs';
import User from '../models/userModel.mjs';
import Department from '../models/departmentModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

export const getStart = catchAsync(async (req, res, next) => {
  res.status(200).render('start', {
    title: 'Start',
  });
});

//exports.getOverview = catchAsync(async (req, res, nexth) => {
export const getOverview = catchAsync(async (req, res, next) => {
  // 1.) Get tour data from collection
  const tours = await Tour.find();

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours, // erstes tours ist das template, zweites tours sind die tourdata
  });
});

//exports.getOverview = catchAsync(async (req, res, nexth) => {
export const getOverviewDepartment = catchAsync(async (req, res, next) => {
  // 1.) Get tour data from collection
  console.log('bin getOverviewDepartment');
  const departments = await Department.find();

  // User.aggregate(
  //   [
  //     {
  //       $group: {
  //         _id: '$department',
  //         users: { $push: '$_id' },
  //       },
  //     },
  //     {
  //       $project: {
  //         department: '$_id',
  //         users: 1,
  //       },
  //     },
  //   ],
  //   function (err, results) {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).json({ error: err });
  //     } else {
  //       //res.json(results);
  //       res.status(200).render('overview', {
  //         title: 'All Departments',
  //         departments: departments, // erstes tours ist das template, zweites tours sind die tourdata
  //       });
  //     }
  //   }
  // );

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  res.status(200).render('overview', {
    title: 'All Departments',
    departments: departments, // erstes tours ist das template, zweites tours sind die tourdata
  });
});

//exports.getTour = catchAsync(async (req, res, next) => {
// export const getTour = catchAsync(async (req, res, next) => {
//   // 1.) Get the data, from the requested tour (inclouding rewievs and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'review rating user',
//   });
//
//   if (!tour) {
//     // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
//     return next(new AppError('There is no tour with that name.', 404)); //404= not found
//   }
//
//   // 2. Build template, but in real not in this controller
//
//   // 3.) Render that template using tour data from 1.)
//
//   res.status(200).render('tour', {
//     title: `${tour.name} tour`, //'The Forrest Hiker Tour',
//     tour,
//   });
// });

export const getTour = catchAsync(async (req, res, next) => {
  // 1.) Get the data, from the requested tour (inclouding rewievs and guides)
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
  //   path: 'reviews',
  //   fields: 'review rating user',
  // });
  console.log('bin getTour in viewController');
  console.log('req.params: ' + JSON.stringify(req.params));

  const tour = await Tour.findOne({ slug: req.params.slug });

  console.log('tour: ' + tour);

  // console.log('-------------------------');
  // console.log('tour: ' + tour);
  // console.log('-------------------------');

  if (!tour) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no tour with that name.', 404)); //404= not found
  }

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  res.status(200).render('department', {
    title: `${tour.name} department`, //'The Forrest Hiker Tour',
    tour,
  });
});

export const getDepartment = catchAsync(async (req, res, next) => {
  // 1.) Get the data, from the requested tour (inclouding rewievs and guides)
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
  //   path: 'reviews',
  //   fields: 'review rating user',
  // });
  console.log('bin getTour in viewController');
  console.log('req.params: ' + JSON.stringify(req.params));

  const department = await Department.findOne({ slug: req.params.slug });

  console.log('department: ' + department);

  // console.log('-------------------------');
  // console.log('tour: ' + tour);
  // console.log('-------------------------');

  if (!department) {
    // wenn dieser block auskommentiert, müsste api-fehler anstatt render kommen
    return next(new AppError('There is no tour with that name.', 404)); //404= not found
  }

  // 2. Build template, but in real not in this controller

  // 3.) Render that template using tour data from 1.)

  res.status(200).render('department', {
    title: `${department.name} department`, //'The Forrest Hiker Tour',
    department,
  });
});

//exports.getLoginForm = (req, res) => {
export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account', //
  });
};

//exports.getAccount = (req, res) => {
export const getAccount = (req, res) => {
  // da protect und isLoggedin middleware bereits user wissen, muss hier nicht fragen
  // frage, der user ist in der req.user drin, jedoch wiso wird der user nicht gesendet unterhalb des titels?
  res.status(200).render('account', {
    title: 'Your account',
  });
};

//video 195 POST userData MEaccount, ohne API, mit POST wie bei ejs method=post
//exports.updateUserData = catchAsync(async (req, res, next) => {
export const updateUserData = catchAsync(async (req, res, next) => {
  console.log('req.User: ', req.user);
  console.log('Updating User: ', req.body); //in app.js muss app.use(express.urlencoded()) sein, um die daten zu sehen

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      //req.user.id den suchen wir, um zu updaten
      name: req.body.name, // req.body.name kommt von name des inputfeldes in pug or ejs
      email: req.body.email,
    },
    {
      // damit nur name und email update, aber keine anderen sachen        PW nicht mit findbyidandupdate machen!!!
      new: true, // die updatet dokument soll neu sein,
      runValidators: true,
    }
  );

  //danach die gleiche seite, aber mit updatet sachen neu laden
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser, // user(daten) auf der seite sind updateUser,
  });
});
//module.exports =
