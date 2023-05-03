import express from 'express';

import { getStart } from '../controllers/viewsController.mjs';

const router = express.Router();

router.get('/', getStart);

export default router;
