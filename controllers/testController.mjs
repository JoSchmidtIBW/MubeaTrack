import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import APIFeatures from '../utils/apiFeatures.mjs';

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
