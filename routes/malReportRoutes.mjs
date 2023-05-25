import express from 'express';

import { getMalReports } from '../controllers/malReportController.mjs'

const router = express.Router();

router.get('/', getMalReports);

export default router;
