import Stripe from 'stripe';
import { updatePaymentStatusByPaymentId ,storeWebhookEvent} from '../services/paymentService.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  // 1. Verify the event signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
    const object = event.data.object;
    const paymentId = object?.metadata?.payment_id || null;
    const projectId = object?.metadata?.project_id || null;
    await storeWebhookEvent({
    event_id: event.id,
    project_id: projectId,
    payment_id: paymentId,
    type: event.type,
    object_id: object.id,
    payload: object
  });

  // 2. Handle event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const paymentId=session.metadata.payment_id;
      console.log('✅ Payment Succeeded:', session.metadata);
      await updatePaymentStatusByPaymentId(paymentId, 'succeeded', session.payment_intent);
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;
      console.log('❌ Async Payment Failed:', paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'failed', session.payment_intent);
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      console.log('✅ Async Payment Succeeded:',paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'succeeded', session.payment_intent);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log('⌛ Session Expired:', paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'expired', session.payment_intent);
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  // 3. Acknowledge receipt
  res.json({ received: true });
};

export default handleStripeWebhook;
