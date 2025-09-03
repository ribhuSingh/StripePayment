import dotenv from 'dotenv';
dotenv.config();

console.log('--- SERVER STARTING ---');
console.log('Is Stripe Key loaded?', !!process.env.STRIPE_SECRET_KEY);
console.log('-----------------------');
// END OF DEBUGGING LINES

import app from './app.js';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));