import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';
import AppError from '../utils/appError.mjs';

export const getAllUsers = catchAsync(async (req, res, next) => {
  // try {
  //const users = await User.find();

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'sucsess',
    results: users.length,
    data: {
      users,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'was ist schief: ' + err,
  //   });
  // }
});

export const getUser = catchAsync(async (req, res, next) => {
  // try {

  const user = await User.findById(req.params.id); // in url /:63fb4c3baac7bf9eb4b72a76 (id in mongo) wenn steht :irgendwas, dann heist req.param.irgendwas
  // Tour.findOne({ _id: req.params.id})  genau wie das: = await Tour.findById(req.params.id) mongodb hat für einfachere funktion findById

  //video 117   wenn id falsch, aber gültige id, anstatt bekommt fehler Null, möchte fehler 404
  if (!user) {
    // Null is false
    return next(new AppError('No Tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err
  //     })
  // }

  // console.log("req.params: " + JSON.stringify(req.params))

  // const id = req.params.id * 1; // macht eine nummer von der url id
  // //const tour = tours.find(el => el.id === id)

  // //if (id > tours.length) {
  // // if (!tour || id > tours.length) {
  // //     res.status(404).json({ status: 'fail', message: 'Invalid ID' })
  // // } else {

  // // }

  // res.status(200).json({
  //     status: 'sucsess',
  //     //results: tours.length,
  //     //data: tour //{ tours: tours }
  // })
});
