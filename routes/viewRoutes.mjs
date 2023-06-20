import express from 'express';

import {
  getLoginForm,
  getDepartment,
  getMachine,
  getAccount,
  //updateUserData,
  getStart,
  getOverviewDepartment,
  getManageUsers,
  getManageMachinery,
  getUpdateUserMachine,
  getCreateUserForm,
  getUpdateUser,
  getCreateMachineForm,
  getUpdateMachine,
  getManageUserMachine,
  getManageASMAMachine,
  getAboutMubeaTrack,
  getAboutMubeaTrackInlogt,
  getAboutASMA,
  getAboutASMAInlogt,
  getContact,
  getContactInlogt,
  getCreateASMAMachine,
  getUpdateSectorASMA,
  getCreateComponents,
  getASMAMachine,
  getUpdateComponentASMA,
  getCreateComponentDetailsASMA,
  getUpdateComponentDetailsASMA,
  getASMAUnterhalt,
  getASMAUnterhaltMachineOpenMalReports,
  getASMAUnterhaltMachineUpdateLogFal,
  getUpdateMalReport,
  getASMAUnterhaltMachineClosedMalReports,
  getMyMalReports,
  getForgotPassword,
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

router.get(
  '/myMalReports',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef', 'user', 'Schichtleiter'),
  getMyMalReports
);

///api/v1/Unterhalt/ASMA
router.get(
  '/:departmentName/ASMA',
  protect,
  restrictTo('admin', 'Unterhalt'),
  getASMAUnterhalt
);

///api/v1/${data.departmentName}/ASMA/${data.machineName}/closedMalReports
router.get(
  '/:departmentName/ASMA/:machineName/closedMalReports',
  protect,
  restrictTo('admin', 'Unterhalt'),
  getASMAUnterhaltMachineClosedMalReports
);

//todo openMalReports
///api/v1/${data.departmentName}/ASMA/${machine.name}/MalReports`
router.get(
  '/:departmentName/ASMA/:machineName/MalReports',
  protect,
  restrictTo('admin', 'Unterhalt'),
  getASMAUnterhaltMachineOpenMalReports
);

///api/v1/${urlDepartmentName}/ASMA/${urlMachineName}/MalReport_updateLogFal/logFal_Repair._id
router.get(
  '/:departmentName/ASMA/:machineName/MalReport_updateLogFal/:logFalID',
  protect,
  restrictTo('admin', 'Unterhalt'),
  getASMAUnterhaltMachineUpdateLogFal
);

//api/v1/Unterhalt/ASMA/Rattunde1/updateMalReport/6473e0dbd6d093647c541c58
router.get(
  '/:departmentName/ASMA/:machineName/updateMalReport/:malReportID',
  protect,
  restrictTo('admin', 'Unterhalt'),
  getUpdateMalReport
);

router.get(
  '/departments/:departmentName/ASMA/:machineName',
  protect,
  isLoggedIn,
  getASMAMachine
);

//router.get('/tour/:id', isLoggedIn, getTour);
//router.get('/tour', isLoggedIn, getTour);

// /login
router.get('/login', isLoggedIn, getLoginForm);
router.get('/forgotPassword', getForgotPassword);

router.get('/me', protect, getAccount); // diese sollte protect sein

router.get(
  '/manage_machinery',
  protect,
  restrictTo('admin', 'Chef'),
  getManageMachinery
);

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

router.get(
  '/manage_machinery/:id',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateMachine
);

router.get(
  '/manage_user-machine',
  protect,
  restrictTo('admin', 'Chef'),
  getManageUserMachine
);

router.get(
  '/manage_usersMachinery/:id',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateUserMachine
);

//router.get('/manage_users/signup', protect, restrictTo('admin'), getSignupForm);

//wenn input post von login, aber ohne api zu fragen (wie ejs method=post)
// update User account
//router.post('/submit-user-data', protect, updateUserData);

router.get(
  '/createUser',
  protect,
  restrictTo('admin', 'Chef'),
  getCreateUserForm
);

router.get(
  '/createMachine',
  protect,
  restrictTo('admin', 'Chef'),
  getCreateMachineForm
);

router.get(
  '/manage_ASMAmachine',
  protect,
  restrictTo('admin', 'Chef'),
  getManageASMAMachine
);

router.get(
  '/createASMAmachine/:id',
  protect,
  restrictTo('admin', 'Chef'),
  getCreateASMAMachine
);

router.get(
  '/createASMAmachine/:machineID/createComponents/:sectorASMAID',
  protect,
  restrictTo('admin', 'Chef'),
  getCreateComponents
);

//createASMAmachine/${data.machine._id}/updateSectorASMA/${sector.id}

router.get(
  '/createASMAmachine/:id/updateSectorASMA/:id',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateSectorASMA
);

router.get(
  '/createASMAmachine/:machineID/:sectorASMAID/updateComponentASMA/:componentASMAID',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateComponentASMA
);

///api/v1/createASMAmachine/${data.machine._id}/${data.sectorASMA._id}/createComponentDetails/${sector.id}`)
router.get(
  '/createASMAmachine/:machineID/:sectorASMAID/createComponentDetails/:componentASMAID',
  protect,
  restrictTo('admin', 'Chef'),
  getCreateComponentDetailsASMA
);

router.get(
  '/createASMAmachine/:machineID/:sectorASMAID/:componentASMAID/updateComponentDetail/:componentDetailASMAID',
  protect,
  restrictTo('admin', 'Chef'),
  getUpdateComponentDetailsASMA
);

router.get('/aboutMubeaTrack', getAboutMubeaTrack);
router.get('/aboutASMA', getAboutASMA);
router.get('/contact', getContact);

router.get('/aboutMubeaTrackInlogt', isLoggedIn, getAboutMubeaTrackInlogt);
router.get('/aboutASMAInlogt', isLoggedIn, getAboutASMAInlogt);
router.get('/contactInlogt', isLoggedIn, getContactInlogt);

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
