"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("../config/passport"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// --- GOOGLE ---
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: `${frontendUrl}/login`, session: false }), (req, res) => {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
});
// --- FACEBOOK ---
router.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: `${frontendUrl}/login`, session: false }), (req, res) => {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
});
// --- GET USER (from JWT) ---
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map