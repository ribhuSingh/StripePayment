import jwt from 'jsonwebtoken';
const SECRET=process.env.SECRET_KEY;
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