import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// This is the data Project A would normally provide
const payload = {
  userId: 'user_test_123',
  email: 'testing@example.com',
  orderId: `order_test_${Date.now()}`,
};

const secret = process.env.PROJECT_A_JWT_SECRET;

// Create a token using the shared secret (HS256 algorithm by default)
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('--- Your Test JWT ---');
console.log(token);