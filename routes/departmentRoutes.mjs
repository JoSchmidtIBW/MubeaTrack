import express from 'express';

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getAllDepartments,
  getDepartmentStats,
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

console.log('bin departmentRoute.mjs');

router.use('/:departmentId/machinery', machineRouter); // muss oben sein

//router.use('/:departmentId', getDepartment); ////////////USE//////////////////

//http://127.0.0.1:4301/api/v1/departments/tour-stats
router.route('/department-stats').get(getDepartmentStats);

router
  .route('/')
  .get(getAllDepartments) // hier möchte man keine protect
  .post(protect, restrictTo('admin'), createDepartment);

router
  .route('/:id')
  .get(getDepartment) //Kostenlos für jederman
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    //uploadDepartmentImages,
    //resizeDepartmentImages,
    updateDepartment
  )
  .delete(protect, restrictTo('admin'), deleteDepartment);

export default router;
