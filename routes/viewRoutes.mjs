import express from 'express';

import {
  getLoginForm,
  getDepartment,
  getMachine,
  getAccount,
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
  protect,
  isLoggedIn,
  restrictTo,
} from '../controllers/authController.mjs';

const router = express.Router();

router.get('/overview', protect, isLoggedIn, getOverviewDepartment);

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
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getASMAUnterhalt
);

router.get(
  '/:departmentName/ASMA/:machineName/closedMalReports',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getASMAUnterhaltMachineClosedMalReports
);

router.get(
  '/:departmentName/ASMA/:machineName/MalReports',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getASMAUnterhaltMachineOpenMalReports
);

router.get(
  '/:departmentName/ASMA/:machineName/MalReport_updateLogFal/:logFalID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getASMAUnterhaltMachineUpdateLogFal
);

router.get(
  '/:departmentName/ASMA/:machineName/updateMalReport/:malReportID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getUpdateMalReport
);

router.get(
  '/departments/:departmentName/ASMA/:machineName',
  protect,
  isLoggedIn,
  getASMAMachine
);

router.get('/login', isLoggedIn, getLoginForm);
router.get('/forgotPassword', getForgotPassword);

router.get('/me', protect, getAccount);

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
