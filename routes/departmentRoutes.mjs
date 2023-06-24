import express from 'express';

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getAllDepartments,
  updateDepartment,
} from '../controllers/departmentController.mjs';

import { protect, restrictTo } from '../controllers/authController.mjs';

import machineRouter from '../routes/machineRoutes.mjs';

const router = express.Router();

router.use('/:departmentId/machinery', machineRouter); // have to stand on this position, in the up

router
  .route('/')
  .get(getAllDepartments) // Here no protect //inactive
  .post(protect, restrictTo('admin'), createDepartment); //inactive

router
  .route('/:id')
  .get(getDepartment) // for everyone //inactive
  .patch(
    protect,
    restrictTo('admin'),
    updateDepartment //inactive
  )
  .delete(protect, restrictTo('admin'), deleteDepartment); //inactive

export default router;
