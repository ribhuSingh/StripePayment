import Stripe from 'stripe';
import knex from 'knex';
import knexConfig from '../../../knexfile.cjs';

// Use environment variable for DB config, defaulting to 'development'
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Compares local database records with Stripe records and fixes discrepancies.
 * This version includes pagination, N+1 query fix, error handling, and consolidated DB updates.
 */
export const runReconciliation = async () => {
    console.log('--- Starting Daily Payment Reconciliation ---');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);    const report = {
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'IN_PROGRESS',
        foundInStripe: 0,
        foundInDb: 0,
        missingFromDb: [],
        extraInDb: [],
        mismatchedStatus: [],
        mismatchedAmount: [],
        mismatchedCurrency: [],
        mismatchedOrderId: [],
        failedUpdates: [], // To track records that failed to update/insert
    };

    try {
        // --- 1. Fetch ALL Stripe paymentIntents using auto-pagination ---
        const stripeData = [];
        const paymentIntentsStream = stripe.paymentIntents.list({
            created: { gte: Math.floor(twentyFourHoursAgo.getTime() / 1000) },
            expand: ['data.latest_charge'],
            limit: 100,
        });

        console.log('Fetching all records from Stripe...');
        for await (const paymentIntent of paymentIntentsStream) {
            stripeData.push(paymentIntent);
        }
        report.foundInStripe = stripeData.length;
        console.log(`Found ${report.foundInStripe} records in Stripe.`);

        // --- 2. Fetch corresponding local DB payments ---
        const localPayments = await db('payments').where('created_at', '>=', twentyFourHoursAgo);
        report.foundInDb = localPayments.length;
        console.log(`Found ${report.foundInDb} records in the local DB.`);

        // Use a Map for efficient lookups and to track which local records are "seen"
        const localPaymentMap = new Map(localPayments.map(p => [p.stripe_payment_intent_id, p]));

        // --- 3. Reconcile Stripe records against the DB ---
        for (const stripePayment of stripeData) {
            const localRecord = localPaymentMap.get(stripePayment.id);

            if (!localRecord) {
                // Case 1: Stripe has the payment, but the DB doesn't. Create it.
                console.log(`- Missing in DB, creating: ${stripePayment.id}`);
                try {
                    await db('payments').insert({
                        order_id: stripePayment.metadata?.order_id || null,
                        stripe_payment_intent_id: stripePayment.id,
                        amount: stripePayment.amount / 100, // Stripe stores in cents
                        currency: stripePayment.currency,
                        status: stripePayment.status,
                        created_at: new Date(stripePayment.created * 1000),
                        updated_at: new Date(),
                    });
                    report.missingFromDb.push(stripePayment.id);
                } catch (error) {
                    console.error(`❌ Failed to insert record for Stripe PI: ${stripePayment.id}`, error);
                    report.failedUpdates.push({ id: stripePayment.id, reason: 'insert failed' });
                }

            } else {
                    // Record exists, check for mismatches and build a single update object
                    const updates = {};
                    
                    // Case 2: Status mismatch
                    if (localRecord.status !== stripePayment.status) {
                        updates.status = stripePayment.status;
                        report.mismatchedStatus.push(stripePayment.id);
                    }

                    // Case 3: Amount mismatch
                    const stripeAmount = stripePayment.amount / 100;
                    const localAmount = Number(localRecord.amount); // Ensure type consistency
                    if (localAmount !== stripeAmount) {
                        updates.amount = stripeAmount;
                        report.mismatchedAmount.push(stripePayment.id);
                    }

                    // Case 4: Currency mismatch
                    if (localRecord.currency !== stripePayment.currency) {
                        updates.currency = stripePayment.currency;
                        report.mismatchedCurrency.push(stripePayment.id);
                    }

                    // Case 5: Order ID mismatch
                    const stripeOrderId = stripePayment.metadata?.order_id || null;
                    if (localRecord.order_id !== stripeOrderId) {
                        updates.order_id = stripeOrderId;
                        report.mismatchedOrderId.push(stripePayment.id);
                    }

                    // If there are any updates, execute a single DB query
                    if (Object.keys(updates).length > 0) {
                        console.log(`- Mismatch found, updating: ${stripePayment.id}`, updates);
                        try {
                            updates.updated_at = new Date(); // Always update the timestamp
                            await db('payments').where({ payment_id: localRecord.payment_id }).update(updates);
                        } catch (error) {
                            console.error(`❌ Failed to update record for Stripe PI: ${stripePayment.id}`, error);
                            report.failedUpdates.push({ id: stripePayment.id, reason: 'update failed' });
                        }
                    }
                    
                    // Mark the local record as "seen" by removing it from the map
                    localPaymentMap.delete(stripePayment.id);
            }
        }

        // --- 4. Identify extra records in the DB ---
            // Any records left in the map were not found in the Stripe data fetch.
            // This is highly efficient and avoids all N+1 API calls.
        for (const extraRecord of localPaymentMap.values()) {
            const id = extraRecord.stripe_payment_intent_id;
            console.log(`- Extra record in DB (not in Stripe's recent list): ${id}`);
            report.extraInDb.push(id);
            // Note: You might want to flag these records for investigation rather than deleting them.
            }

            report.status = 'SUCCESS';
    } catch (error) {
        console.error('--- 🚨 An unexpected error stopped the reconciliation process ---', error);
        report.status = 'FAILED';
    } finally {
        report.endTime = new Date().toISOString();
        console.log('--- Reconciliation Complete ---', report);
    }

 return report;
};