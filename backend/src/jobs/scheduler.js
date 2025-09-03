import cron from 'node-cron';
import { runReconciliation } from '../api/services/reconciliationService.js';

export const initScheduledJobs = () => {
  console.log('Scheduler initialized.');

  // Schedule the reconciliation job to run at 2:00 AM every day
  // Cron format: (minute hour day-of-month month day-of-week)
  const scheduledJob = cron.schedule('0 2 * * *', () => {
    console.log('--- Running scheduled daily reconciliation job ---');
    runReconciliation();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Use your server's timezone
  });

  scheduledJob.start();
};