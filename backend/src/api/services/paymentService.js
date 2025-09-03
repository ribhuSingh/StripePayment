import knex from "knex";
import knexConfig from '../../../knexfile.cjs'; // your knex instance
const db = knex(knexConfig.development);
export const findOrCreatePaymentUser = async ({ project_id, email, phone, external_user_id }) => {
  let user = await db('PaymentUsers').where({ email, project_id }).first();

  if (!user) {
    const [newUser] = await db('PaymentUsers')
      .insert({
        project_id,
        email,
        phone,
        external_user_id
      })
      .returning('*'); // works in PostgreSQL; in MySQL you’d query again
    user = newUser;
  }

  return user;
};

export const createPaymentRecord = async ({
  project_id,
  payment_user_id,
  order_id,
  stripe_payment_intent_id,
  stripe_checkout_session_id,
  amount,
  currency,
  status
}) => {
  const [payment] = await db('Payments')
    .insert({
      project_id,
      payment_user_id,
      order_id,
      stripe_payment_intent_id,
      stripe_checkout_session_id,
      amount,
      currency,
      status
    })
    .returning('*');

  return payment;
};
export const updatePaymentStatusByPaymentId = async (
  payment_id,
  status,
  stripe_payment_intent_id
) => {
  try {
    // Perform update
    const updatedRows = await db('Payments')
      .where({ payment_id })
      .update({
        status,
        stripe_payment_intent_id,
      });

    if (updatedRows === 0) {
      console.warn(`⚠️ No payment found for paymentId: ${payment_id}`);
      return null;
    }

    // Fetch the updated record (manual select for MySQL)
    const updatedPayment = await db('Payments')
      .where({ payment_id })
      .first();

    console.log(`✅ Payment status updated: ${payment_id} → ${status}`);
    return updatedPayment;
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    throw error;
  }
};


export const storeWebhookEvent = async ({
  event_id,
  project_id,
  payment_id = null, // optional, if available
  type,
  object_id,
  payload
}) => {
  try {
    await db('WebhookEvents').insert({
      event_id,
      project_id,
      payment_id,
      type,
      object_id,
      payload: JSON.stringify(payload),
    });

    console.log(`📩 Stored webhook event: ${event_id} (${type}) for payment_id=${payment_id}`);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn(`⚠️ Duplicate webhook event skipped: ${event_id}`);
      return null;
    }
    console.error('❌ Error storing webhook event:', error);
    throw error;
  }
};
