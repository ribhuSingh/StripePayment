import express from 'express';
import cors from 'cors';

import paymentRoutes from './src/api/routes/paymentRoutes.js';
import webhookRoutes from './src/api/routes/webhookRoutes.js';
import reconciliationRoutes from './src/api/routes/reconciliationRoutes.js'
import authRoutes from './src/api/routes/authRoutes.js';
import dashboardInfo from './src/api/routes/dashboardInfo.js'
const app = express();

app.use(cors());

app.use('/api/webhooks', webhookRoutes);
app.use('/api/reconciliation', reconciliationRoutes);

app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboardInfo',dashboardInfo);

export default app;