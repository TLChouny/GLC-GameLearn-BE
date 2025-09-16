import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from '../config/passport';
import  User  from '../models/User';

const router = Router();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// --- GOOGLE ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${frontendUrl}/login`, session: false }),
  (req: Request, res: Response) => {
    const user = req.user as typeof User;
    const token = jwt.sign({ id: (user as any)._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
  }
);

// --- FACEBOOK ---
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${frontendUrl}/login`, session: false }),
  (req: Request, res: Response) => {
    const user = req.user as typeof User;
    const token = jwt.sign({ id: (user as any)._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
  }
);

// --- Facebook Data Deletion (required by Facebook) ---
// Spec: Respond with { url, confirmation_code }
router.post('/facebook/data-deletion', (req: Request, res: Response) => {
  const confirmationCode = crypto.randomBytes(8).toString('hex');
  const statusUrl = `${frontendUrl}/data-deletion.html?code=${confirmationCode}`;
  res.json({ url: statusUrl, confirmation_code: confirmationCode });
});

// Optional: status check endpoint if Facebook or user revisits with code
router.get('/facebook/data-deletion-status', (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).json({ success: false, message: 'Missing code' });
  // In real implementation, look up deletion job by code and return its status
  res.json({ success: true, code, status: 'received' });
});

// --- GET USER (from JWT) ---
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
