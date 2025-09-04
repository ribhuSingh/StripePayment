import db from '../../../config/db.js';
import jwt from 'jsonwebtoken';
import { OUR_PROJECT_JWT_SECRET } from "../../../config/env.js";
import bcrypt from 'bcrypt'

const generateToken = (id) => {
  const payload = { admin_id: id };
  const secret = OUR_PROJECT_JWT_SECRET;
  if (!secret) {
      throw new Error('JWT Secret not found in environment variables.');
  }
  
  // Best Practice: Use a shorter, more secure token lifetime
  const options = { expiresIn: '30d' }; 

  return jwt.sign(payload, secret, options);
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validationk
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    // 2. Check if the user already exists
    const existingUser = await db('Admin').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email.' }); // 409 Conflict is more specific
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // ✅ FIX: Hash the correct variable

    // 4. Insert the new user with the HASHED password
    const [newUserId] = await db('Admin').insert({
      email,
      password: hashedPassword, // ✅ FIX: Save the hashed password
    });

    // 5. Fetch the newly created user to confirm and get all data
    const newUser = await db('Admin').where({ id: newUserId }).first();

    if (newUser) {
      // 6. Respond with the new user's data and a JWT
      res.status(201).json({
        success: true,
        message: "Registration successful!",
        user: {
          id: newUser.id,
          email: newUser.email,
          token: generateToken(newUser.id),
        }
      });
    } else {
      // This case should rarely happen if the insert was successful
      res.status(500).json({ success: false, message: 'Failed to create user after insert.' });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    // 2. Find the user in the 'Admin' table by their email
    const adminUser = await db('Admin').where({ email }).first();

    // 3. Check if user exists AND if the password is correct
    // Use bcrypt.compare to safely check the password against the stored hash.
    // This check is intentionally combined to prevent timing attacks.
    if (adminUser && (await bcrypt.compare(password, adminUser.password))) {
      // Passwords match, user is authenticated
      res.status(200).json({
        success: true,
        message: "Login successful!",
        user: {
          id: adminUser.id,
          email: adminUser.email,
          token: generateToken(adminUser.id),
        }
      });
    } else {
      // User not found or password does not match
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};
