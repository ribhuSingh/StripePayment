import express from 'express';
import {register,login} from '../controllers/authController.js'
import { verifyAdminToken } from '../middleware/authMiddleware.js';
const router=express.Router();
router.post('/register',verifyAdminToken,register);
router.post('/login',login);
export default router;