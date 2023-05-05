import express from 'express';

import {
  getLoginForm,
  getDepartment,
  getAccount,
  updateUserData,
  getStart,
  getOverviewDepartment,
  getManageUsers,
  getCreateNewUserForm,
  getUpdateUser,
  getMachine,
} from '../controllers/viewsController.mjs';

import {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.mjs';

const router = express.Router();

//router.use(authController.isLoggedIn) // alle ab hier, haben diese middleware,  isLoggedIn will run for all request

//router.get('/', getStart);
router.get('/overview', protect, isLoggedIn, getOverviewDepartment); // /overview   // das ist die erstee seite

//http://localhost:4301/tours/the-forest-hiker
//router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/departments/:slug', protect, isLoggedIn, getDepartment);

router.get(
  '/departments/:slug/machinery/:slug',
  protect,
  isLoggedIn,
  getMachine
);

//router.get('/tour/:id', isLoggedIn, getTour);
//router.get('/tour', isLoggedIn, getTour);

// /login
router.get('/login', isLoggedIn, getLoginForm);

router.get('/me', protect, getAccount); // diese sollte protect sein

router.get(
  '/manage_users',
  protect,
  restrictTo('admin', 'Chef'),
  getManageUsers
);
router.get(
  '/manage_users/:id',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateUser
);
//router.get('/manage_users/signup', protect, restrictTo('admin'), getSignupForm);

//wenn input post von login, aber ohne api zu fragen (wie ejs method=post)
// update User account
router.post('/submit-user-data', protect, updateUserData);

router.get(
  '/createNewUser',
  protect,
  restrictTo('admin'),
  getCreateNewUserForm
);

export default router;

//----------------------------------------------------------Old-----------------
//router.get('/overview', viewsController.getOverview)
// router.get('/overview', (req, res) => {
//     res.status(200).render('overview', {
//         title: 'All Tours',
//     })
// })

// router.get('/', (req, res, ) => {
//         res.status(200).render('base', {
//             tour: 'The Forrest hiker',
//             user: 'Jonas',
//         })
//     })
//     // app.get('/ejs', (req, res, ) => {
//     //     res.status(200).render('basee')
//     // })
