import express from 'express';

import {
  getMalReportsMachine,
  getUpdateLogFal,
} from '../controllers/malReportController.mjs';

const router = express.Router();

router.get('/:machineID', getMalReportsMachine);
//${apiUrl}/malReports/${malReportID}/updateLogFal/${malReportLogFalID}`,
router.patch('/:malReportID/updateLogFal/:malReportLogFalID', getUpdateLogFal);

export default router;
