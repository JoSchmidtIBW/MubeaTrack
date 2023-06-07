import express from 'express';

import {
  getMalReportsMachine,
  getUpdateLogFal,
  getCloseMalReport,
  getCreateLogFal,
  getMyMalReports,
  getClosedMalReportsMachine,
} from '../controllers/malReportController.mjs';

const router = express.Router();

router.get('/:machineID', getMalReportsMachine);
router.patch('/closeMalReport/:malReportID', getCloseMalReport);
//${apiUrl}/malReports/${malReportID}/updateLogFal/${malReportLogFalID}`,
router.patch('/:malReportID/updateLogFal/:malReportLogFalID', getUpdateLogFal);
router.patch('/:malReportID/createLogFal', getCreateLogFal);
router.get('/myMalReports/:userID', getMyMalReports);
router.get('/closedMalReports/:machineName', getClosedMalReportsMachine);

export default router;
