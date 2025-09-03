import express from 'express';
import  createCheckoutSession  from '../controllers/paymentController.js';
import { projectAuthentication } from '../middleware/projectAuthentication.js';


const router = express.Router();
router.post('/create-checkout-session',createCheckoutSession);
export default router;