"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
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
// --- Facebook Data Deletion (required by Facebook) ---
// Spec: Respond with { url, confirmation_code }
router.post('/facebook/data-deletion', (req, res) => {
    const confirmationCode = crypto_1.default.randomBytes(8).toString('hex');
    const statusUrl = `${frontendUrl}/data-deletion.html?code=${confirmationCode}`;
    res.json({ url: statusUrl, confirmation_code: confirmationCode });
});
// Optional: status check endpoint if Facebook or user revisits with code
router.get('/facebook/data-deletion-status', (req, res) => {
    const code = req.query.code;
    if (!code)
        return res.status(400).json({ success: false, message: 'Missing code' });
    // In real implementation, look up deletion job by code and return its status
    res.json({ success: true, code, status: 'received' });
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