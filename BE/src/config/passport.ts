import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import  User  from '../models/User';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'));

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email,
            role: 'user',
            avatar: profile.photos?.[0]?.value,
            verified: true,
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
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Facebook'));

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email,
            role: 'user',
            avatar: profile.photos?.[0]?.value,
            verified: true,
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
