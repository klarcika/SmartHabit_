const { clerkClient, verifyToken } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Ni tokena v headerju' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.clerkId = payload.sub;

    const clerkUser = await clerkClient.users.getUser(payload.sub);
    req.userEmail = clerkUser.emailAddresses[0]?.emailAddress || '';
    req.userName = clerkUser.firstName || 'Uporabnik';

    next();
  } catch (err) {
    console.error('Napaka pri preverjanju Clerk tokena:', err);
    res.status(401).json({ message: 'Neveljaven token' });
  }
};

module.exports = { protect };
