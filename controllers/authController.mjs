//neue User erstellen, log in, update password ist im Authentifizierungscontroller
import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';

exports.signup = catchAsync(async (req, res, next) => {
  // wie createUser aber in authentifizierungsController
  const newUser = await User.create(req.body); // daten sind im body, und returnt ein promis, darum await

  res.status(201).json({
    // 201 für created
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
