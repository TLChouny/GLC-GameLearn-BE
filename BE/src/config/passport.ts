import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback as GoogleVerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import bcrypt from 'bcryptjs';
import  User  from '../models/User';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
    },
    async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: GoogleVerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'));

        let user = await User.findOne({ email });
        if (!user) {
          const baseUserName = (profile.displayName || email.split('@')[0] || 'user')
            .replace(/\s+/g, '')
            .toLowerCase();
          const userName = `${baseUserName}-${profile.id?.slice(-4) || 'gl'}`;
          const randomPassword = Math.random().toString(36).slice(-12);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = new User({
            userName,
            email,
            password: hashedPassword,
            gender: 'other',
            address: 'N/A',
            role: 'student',
            avatar: profile.photos?.[0]?.value,
            isVerified: true,
            oauth: {
              googleId: profile.id,
              provider: 'google',
            },
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: `${backendUrl}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (_accessToken: string, _refreshToken: string, profile: FacebookProfile, done: (error: any, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Facebook'));

        let user = await User.findOne({ email });
        if (!user) {
          const baseUserName = (profile.displayName || email.split('@')[0] || 'user')
            .replace(/\s+/g, '')
            .toLowerCase();
          const userName = `${baseUserName}-${profile.id?.slice(-4) || 'fb'}`;
          const randomPassword = Math.random().toString(36).slice(-12);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = new User({
            userName,
            email,
            password: hashedPassword,
            gender: 'other',
            address: 'N/A',
            role: 'student',
            avatar: profile.photos?.[0]?.value,
            isVerified: true,
            oauth: {
              facebookId: profile.id,
              provider: 'facebook',
            },
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

export default passport;
