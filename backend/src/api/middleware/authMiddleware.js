import jwt from 'jsonwebtoken';
import db from '../../../config/db.js';
import { OUR_PROJECT_JWT_SECRET } from '../../../config/env.js';
export const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  // Best Practice: Load the secret from environment variables for security
  const adminSecret =OUR_PROJECT_JWT_SECRET;
  if (!adminSecret) {
    console.error("Admin JWT secret is not configured.");
    return res.status(500).json({ error: 'Internal server configuration error.' });
  }

  try {
    // 1. Verify the token using the secret
    const decoded = jwt.verify(token, adminSecret);

    // 2. ✅ FIX: Extract the 'admin_id' from the token, not the email
    const { admin_id } = decoded;
    if (!admin_id) {
      return res.status(403).json({ error: 'Token is missing the admin identifier.' });
    }

    // 3. ✅ FIX: Find the admin user by their primary key 'id'
    const adminUser = await db('Admin').where({ id: admin_id }).first();
    
    // 4. Ensure the user still exists in your database
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user associated with this token not found.' });
    }
    
    // 5. ✅ SECURITY FIX: Delete the password before attaching the user to the request
    delete adminUser.password;
    req.user = adminUser; 

    next();
  } catch (error) {
    // This will catch errors like an expired token or invalid signature
    return res.status(403).json({ error: 'Token is not valid.', details: error.message });
  }
};