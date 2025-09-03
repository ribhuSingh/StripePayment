import express from 'express';
import  handleStripeWebhook  from '../controllers/webhookController.js';

const router = express.Router();

// This route uses express.raw() to get the raw request body, which is
// essential for Stripe's signature verification process.
router.use('/stripe',express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;