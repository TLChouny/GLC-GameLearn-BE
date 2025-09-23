"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendUrl}/api/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error('No email from Google'));
        let user = await User_1.default.findOne({ email });
        if (!user) {
            const baseUserName = (profile.displayName || email.split('@')[0] || 'user')
                .replace(/\s+/g, '')
                .toLowerCase();
            const userName = `${baseUserName}-${profile.id?.slice(-4) || 'gl'}`;
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
            user = new User_1.default({
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
    }
    catch (err) {
        return done(err, undefined);
    }
}));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${backendUrl}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error('No email from Facebook'));
        let user = await User_1.default.findOne({ email });
        if (!user) {
            const baseUserName = (profile.displayName || email.split('@')[0] || 'user')
                .replace(/\s+/g, '')
                .toLowerCase();
            const userName = `${baseUserName}-${profile.id?.slice(-4) || 'fb'}`;
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
            user = new User_1.default({
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
    }
    catch (err) {
        return done(err, undefined);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map