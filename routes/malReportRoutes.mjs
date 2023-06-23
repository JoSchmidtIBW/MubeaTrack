import express from 'express';

import {
  getMalReportsMachine,
  getUpdateLogFal,
  getCloseMalReport,
  getCreateLogFal,
  getMyMalReports,
  getClosedMalReportsMachine,
} from '../controllers/malReportController.mjs';

import { protect, restrictTo } from '../controllers/authController.mjs';

const router = express.Router();

router.get(
  '/:machineID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getMalReportsMachine
);
router.patch(
  '/closeMalReport/:malReportID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getCloseMalReport
);
//${apiUrl}/malReports/${malReportID}/updateLogFal/${malReportLogFalID}`,
router.patch(
  '/:malReportID/updateLogFal/:malReportLogFalID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getUpdateLogFal
);
router.patch(
  '/:malReportID/createLogFal',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getCreateLogFal
);
router.get(
  '/myMalReports/:userID',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef', 'user', 'Schichtleiter'),
  getMyMalReports
); //'admin', 'Unterhalt', 'Chef', 'user', 'Schichtleiter'
router.get(
  '/closedMalReports/:machineName',
  protect,
  restrictTo('admin', 'Unterhalt', 'Chef'),
  getClosedMalReportsMachine
);

export default router;
