import Stripe from 'stripe';
import { updatePaymentStatusByPaymentId ,storeWebhookEvent} from '../services/paymentService.js';
import { STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET } from '../../../config/env.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {

  const sig = req.headers['stripe-signature'];
  const endpointSecret = STRIPE_WEBHOOK_SECRET;
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
    const orderId=object?.metadata?.orderId || null;
    console.log('intent_id',event.data.object.payment_intent,event.type)
    await storeWebhookEvent({
      event_id: event.id,
      project_id: projectId,
      payment_id: paymentId,
      type: event.type,
      object_id: orderId,
      payload: object
    });


  // 2. Handle event types
  switch (event.type) {

    case 'payment_intent.payment_failed': {
      const intent = event.data.object;
      console.log('❌ Async Payment Failed:', paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'failed', intent.id);
      break;
    }

    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      console.log('✅ Async Payment Succeeded:',paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'succeeded', intent.id);
      break;
    }
    

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log('⌛ Session Expired:', paymentId);
      await updatePaymentStatusByPaymentId(paymentId, 'expired', session.payment_intent);
      break;
    }
    case 'payment_intent.canceled':{
      const intent=event.data.object;
      console.log('Payment_intent canceled',paymentId);
      await updatePaymentStatusByPaymentId(paymentId,'canceled',intent.id);
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  // 3. Acknowledge receipt
  res.json({ received: true });
};

export default handleStripeWebhook;
