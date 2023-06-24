import express from 'express';

import {
  getMe,
  updateMe,
  deleteMe,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getForgotPasswordAdmin,
  getUsersMachinery,
  getUpdateUserMachinery,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController.mjs';

import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.mjs';

const router = express.Router();

router.get('/', getAllUsers);

router.post('/forgotPasswordAdmin', getForgotPasswordAdmin);
router.post('/forgotPassword', forgotPassword); // Inactive

router
  .route('/usersMachinery')
  .get(protect, restrictTo('admin', 'Chef'), getUsersMachinery);

router
  .route('/updateUserMachinery/:userID')
  .patch(protect, restrictTo('admin', 'Chef'), getUpdateUserMachinery);

//authentication
router.post('/signup', signup); // Inactive
router.post('/login', login);
router.get('/logout', logout);
router.patch('/resetPassword/:token', resetPassword); // Inactive

//Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

//All routes are only for admin and Chef after this middleware
router.use(restrictTo('admin', 'Chef'));

router.post('/createNewUser', createUser);
router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);

export default router;
