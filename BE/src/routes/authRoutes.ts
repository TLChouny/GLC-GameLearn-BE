import { Router, Request, Response } from 'express';
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
