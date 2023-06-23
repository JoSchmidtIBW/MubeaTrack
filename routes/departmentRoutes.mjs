import express from 'express';

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getAllDepartments,
  updateDepartment,
  uploadDepartmentImages,
  resizeDepartmentImages,
} from '../controllers/departmentController.mjs';

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

import machineRouter from '../routes/machineRoutes.mjs';

const router = express.Router();

router.use('/:departmentId/machinery', machineRouter); // have to stand on this position, in the up

//router.use('/:departmentId', getDepartment); ////////////USE//////////////////

router
  .route('/')
  .get(getAllDepartments) // Here no protect
  .post(protect, restrictTo('admin'), createDepartment); //inactive

router
  .route('/:id')
  .get(getDepartment) //for everyone
  .patch(
    protect,
    restrictTo('admin'),
    //uploadDepartmentImages,
    //resizeDepartmentImages,
    updateDepartment
  )
  .delete(protect, restrictTo('admin'), deleteDepartment); //inactive

export default router;
