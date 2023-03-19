import express from 'express';
import { getAllUsers, getUser } from '../controllers/testController.mjs';

const router = express.Router();

//http://127.0.0.1:7566/api/v1/users
router.route('/').get(getAllUsers);

//127.0.0.1:7566/api/v1/users/:id
http: router.route('/:id').get(getUser);

export default router;
