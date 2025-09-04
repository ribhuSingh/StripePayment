import { PORT } from './config/env.js';

console.log('--- SERVER STARTING ---');

import app from './app.js';

app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));