// import jwt from 'jsonwebtoken';
// import fs from 'fs';
// import path from 'path';

// // --- IMPORTANT ---
// // 1. Create a file named 'projectA_public.pem' in the root of your 'backend-express' project.
// // 2. Paste the PUBLIC key provided by Project A into that file.
// const publicKeyPath = path.resolve(process.cwd(), 'projectA_public.pem');
// const publicKey = fs.readFileSync(publicKeyPath);

// export const verifyProjectAToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided.' });
//   }

//   try {
//     // Verify the token using the public key and RS256 algorithm
//     const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    
//     // Attach the verified user data to the request object
//     req.user = decoded; 
//     next();
//   } catch (error) {
//     // This will catch errors for invalid signature, expired token, etc.
//     return res.status(403).json({ error: 'Token is not valid.', details: error.message });
//   }
// };

import jwt from 'jsonwebtoken';

export const verifyProjectAToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    // Verify the token using the shared secret
    const decoded = jwt.verify(token, process.env.PROJECT_A_JWT_SECRET);
    
    // Attach the verified user data to the request object
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token is not valid.', details: error.message });
  }
};