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
  //getForgotPasswordAdmin,
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
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.mjs';

const router = express.Router();

//http: //127.0.0.1:4301/api/v1/users/
router.get('/', getAllUsers);

//router.post('/forgotPasswordAdmin', getForgotPasswordAdmin);
router.post('/forgotPassword', forgotPassword); //für jederman // inaktiv

router
  .route('/usersMachinery')
  .get(protect, restrictTo('admin', 'Chef'), getUsersMachinery);

router
  .route('/updateUserMachinery/:userID')
  .patch(protect, restrictTo('admin', 'Chef'), getUpdateUserMachinery);

//authentication
//http: //127.0.0.1:4301/api/v1/users/signup
router.post('/signup', signup); // Inaktiv //hat kein get, und kein update,     post in postman!// für jederman
//http: //127.0.0.1:4301/api/v1/users/login
router.post('/login', login); // nur post, sendet passwort und employeeNumber, kein get, kein update  //für jederman

router.get('/logout', logout); // muss nur get sein, schicken keine daten oder ändern welche
//{{URL}}api/v1/users/forgotPassword

//{{URL}}api/v1/users/resetPassword/:token   PATCH
router.patch('/resetPassword/:token', resetPassword); //Inaktiv  //für jederman

//Protect all routes after this middleware
router.use(protect); // ab hier, alle middleware sind protected

//http: //127.0.0.1:4301/api/v1/users/updateMyPassword
//router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
router.patch('/updateMyPassword', updatePassword);

//router.get('/me', authController.protect, userController.getMe, userController.getUser)
router.get('/me', getMe, getUser);
//{{URL}}api/v1/users/updateMe
//router.patch('/updateMe', authController.protect, userController.updateMe)
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe); // single, weil ein single File //upload.single('photo'),
//{{URL}}api/v1/users/deleteMe
//router.delete('/deleteMe', authController.protect, userController.deleteMe)
router.delete('/deleteMe', deleteMe); // Inaktiv

//All routes are only for admin after this middleware
router.use(restrictTo('admin', 'Chef'));

//http: //127.0.0.1:4301/api/v1/users
//router.route('/').get(getAllUsers).post(createUser);

router.post('/createNewUser', createUser);

//http: //127.0.0.1:4301/api/v1/users/:id
router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);

export default router;

//-------------------------------Old--------------------------------------------------
// import express from 'express';
//
// import {
//   getMe,
//   updateMe,
//   deleteMe,
//   getUser,
//   getAllUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   uploadUserPhoto,
//   resizeUserPhoto,
// } from '../controllers/userController.mjs';
//
// import {
//   signup,
//   login,
//   logout,
//   protect,
//   isLoggedIn,
//   restrictTo,
//   forgotPassword,
//   resetPassword,
//   updatePassword,
// } from '../controllers/authController.mjs';
//
// // import multer from 'multer';
// //
// // // hier bei beginning   eine middleware
// // const upload = multer({ dest: 'public/img/users' }); // das ist der ort, wo alle fotos von user gespeichert werden sollen
//
// const router = express.Router();
//
// router.get('/', getAllUsers);
//
// //authentication
// //http: //127.0.0.1:4301/api/v1/users/signup
// router.post('/signup', signup); //hat kein get, und kein update,     post in postman!// für jederman
// //http: //127.0.0.1:4301/api/v1/users/login
// router.post('/login', login); // nur post, sendet passwort und email, kein get, kein update  //für jederman
//
// router.get('/logout', logout); // muss nur get sein, schicken keine daten oder ändern welche
// //{{URL}}api/v1/users/forgotPassword
// router.post('/forgotPassword', forgotPassword); //für jederman
// //{{URL}}api/v1/users/resetPassword/:token   PATCH
// router.patch('/resetPassword/:token', resetPassword); //für jederman
//
// //Protect all routes after this middleware
// router.use(protect); // ab hier, alle middleware sind protected
//
// //http: //127.0.0.1:4301/api/v1/users/updateMyPassword
// //router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
// router.patch('/updateMyPassword', updatePassword);
//
// //router.get('/me', authController.protect, userController.getMe, userController.getUser)
// router.get('/me', getMe, getUser);
// //{{URL}}api/v1/users/updateMe
// //router.patch('/updateMe', authController.protect, userController.updateMe)
// router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe); // single, weil ein single File //upload.single('photo'),
// //{{URL}}api/v1/users/deleteMe
// //router.delete('/deleteMe', authController.protect, userController.deleteMe)
// router.delete('/deleteMe', deleteMe);
//
// //All routes are onli for admin after this middleware
// router.use(restrictTo('admin'));
//
// //http: //127.0.0.1:4301/api/v1/users
// //router.route('/').get(getAllUsers).post(createUser);
//
// router.post('/createNewUser', createUser);
//
// //http: //127.0.0.1:4301/api/v1/users/:id
// router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);
//
// //module.exports = router;
// export default router;
//
//

//-----------------------------------------------------
// import express from 'express';
// import userController from '../controllers/userController.mjs';
// import authController from '../controllers/authController.mjs';
// import { signup, login } from '../controllers/authController.mjs';
//
// const router = express.Router();

// //authentication
// //http: //127.0.0.1:4301/api/v1/users/signup
// router.post('/signup', authController.signup); //hat kein get, und kein update,     post in postman!// für jederman
// //http: //127.0.0.1:4301/api/v1/users/login
// router.post('/login', authController.login); // nur post, sendet passwort und email, kein get, kein update  //für jederman
//
// router.get('/logout', authController.logout); // muss nur get sein, schicken keine daten oder ändern welche
// //{{URL}}api/v1/users/forgotPassword
// router.post('/forgotPassword', authController.forgotPassword); //für jederman
// //{{URL}}api/v1/users/resetPassword/:token   PATCH
// router.patch('/resetPassword/:token', authController.resetPassword); //für jederman
//
// //Protect all routes after this middleware
// router.use(authController.protect); // ab hier, alle middleware sind protected
//
// //http: //127.0.0.1:4301/api/v1/users/updateMyPassword
// //router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
// router.patch('/updateMyPassword', authController.updatePassword);
//
// //router.get('/me', authController.protect, userController.getMe, userController.getUser)
// router.get('/me', userController.getMe, userController.getUser);
// //{{URL}}api/v1/users/updateMe
// //router.patch('/updateMe', authController.protect, userController.updateMe)
// router.patch('/updateMe', userController.updateMe);
// //{{URL}}api/v1/users/deleteMe
// //router.delete('/deleteMe', authController.protect, userController.deleteMe)
// router.delete('/deleteMe', userController.deleteMe);
//
// //All routes are onli for admin after this middleware
// router.use(authController.restrictTo('admin'));
//
// //http: //127.0.0.1:4301/api/v1/users
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);
//
// //http: //127.0.0.1:4301/api/v1/users/:id
// router
//   .route('/:id')
//   .get(authController.protect, userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);
//
// //module.exports = router;
// export default router;
