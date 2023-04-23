import express from 'express';

//const viewsController = require('../controllers/viewsController');
import {
  getLoginForm,
  getDepartment,
  getAccount,
  updateUserData,
  getStart,
  getOverviewDepartment,
} from '../controllers/viewsController.mjs';
//const authController = require('../controllers/authController')
//import authController from '../controllers/authController.mjs';
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

// router.get('/', (req, res, ) => {
//         res.status(200).render('base', {
//             tour: 'The Forrest hiker',
//             user: 'Jonas',
//         })
//     })
//     // app.get('/ejs', (req, res, ) => {
//     //     res.status(200).render('basee')
//     // })

router.get('/overview', isLoggedIn, getOverviewDepartment); // /overview   // das ist die erstee seite
router.get('/', getStart);

//router.get('/overview', viewsController.getOverview)
// router.get('/overview', (req, res) => {
//     res.status(200).render('overview', {
//         title: 'All Tours',
//     })
// })

//http://localhost:4301/tours/the-forest-hiker
//router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/departments/:slug', isLoggedIn, getDepartment);
//router.get('/tour/:id', isLoggedIn, getTour);
//router.get('/tour', isLoggedIn, getTour);

// router.get('/tour', (req, res) => {
//     res.status(200).render('tour', {
//         title: 'The Forrest Hiker Tour',
//     })
// })

// /login
router.get('/login', isLoggedIn, getLoginForm);

router.get('/me', protect, getAccount); // diese sollte protect sein

//wenn input post von login, aber ohne api zu fragen (wie ejs method=post)
// update User account
router.post('/submit-user-data', protect, updateUserData);

//module.exports = router

export default router;
