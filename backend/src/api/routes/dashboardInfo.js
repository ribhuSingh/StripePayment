import express from 'express';
import dashboardInfoController from '../controllers/dashboardInfoController.js'
import { verifyAdminToken } from '../middleware/authMiddleware.js';
const router=express.Router();
router.get('/allData',verifyAdminToken,dashboardInfoController);
export default router;
