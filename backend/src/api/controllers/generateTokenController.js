import jwt from 'jsonwebtoken';
import { OUR_PROJECT_JWT_SECRET } from '../../../config/env.js';
const SECRET=OUR_PROJECT_JWT_SECRET;
const generateToken = async (req, res) => {
  try {
    const payload={
        userName:userName,
        password:password
    }
    const token=jwt.sign(payload,SECRET,{expiresIn:'24h'});

    return res.status(200).json({ redirectUrl: session.url });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default generateToken;