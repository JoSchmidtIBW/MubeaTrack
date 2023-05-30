import express from 'express';

import {
  getMalReportsMachine,
  getUpdateLogFal,
  getCloseMalReport,
} from '../controllers/malReportController.mjs';

const router = express.Router();

router.get('/:machineID', getMalReportsMachine);
router.patch('/closeMalReport/:malReportID', getCloseMalReport);
//${apiUrl}/malReports/${malReportID}/updateLogFal/${malReportLogFalID}`,
router.patch('/:malReportID/updateLogFal/:malReportLogFalID', getUpdateLogFal);

export default router;
