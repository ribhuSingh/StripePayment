import express from 'express';
import { triggerReconciliation } from '../controllers/reconciliationController.js';

const router = express.Router();


router.post('/run', triggerReconciliation);

export default router;