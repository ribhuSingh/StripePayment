import { findOrCreatePaymentUser, createPaymentRecord } from "../services/paymentService.js";
import db from "../../../config/db.js";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../../../config/env.js";
const stripe = new Stripe(STRIPE_SECRET_KEY); 

const createCheckoutSession = async (req, res) => {
  const { name, email, address, phone, amount, orderId, url, external_user_id } = req.body;

  // 1. Validate project
  const project = await db('projects')
    .where({ project_url: url })
    .first();

  if (!project) {
    return res.status(401).json({ message: "Project not registered" });
  }

  const project_id = project.project_id;

  try {
    // 2. Find or create user
    const user = await findOrCreatePaymentUser({
      project_id,
      email,
      phone,
      external_user_id: external_user_id || null,
    });
    console.log('ribhuuser',user);

    // 3. First create the payment record with pending status
    const payment = await createPaymentRecord({
      project_id,
      payment_user_id: user.payment_user_id,
      order_id: orderId,
      stripe_checkout_session_id: null, // will fill later
      stripe_payment_intent_id: null,
      amount,
      currency: 'usd',
      status: 'initiated',
    });
    console.log('paymentTable',payment)

    // 4. Create Stripe session (include payment_id in metadata)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: "Order " + orderId },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/completion`,
      cancel_url: `http://localhost:5173/rejection`,
       payment_intent_data: {
        metadata: {
          payment_id: payment,
          order_id: orderId ,
          project_id:project_id,
          payment_user_id: user.payment_user_id
        }
      },
      
      metadata: { payment_id: payment,order_id:orderId,project_id:project_id, payment_user_id:user.payment_user_id }
    }
    );
    console.log('ribhusession',session)
    // 5. Update the payment record with session info
    await db('Payments')
      .where({ payment_id: payment })  // ✅ correct where condition
      .update({
        stripe_checkout_session_id: session.id,
      });

    // 6. Send session URL to frontend
    res.status(200).json({ redirectUrl: session.url });

  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export default createCheckoutSession;
