"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPoints = exports.addFriend = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register new user
const registerUser = async (req, res) => {
    try {
        const { userName, email, password, gender, address, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { userName }]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create new user
        const newUser = new User_1.default({
            userName,
            email,
            password: hashedPassword,
            gender,
            address,
            role: role || 'student',
            points: 0,
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                totalScore: 0,
                averageScore: 0
            },
            listFriend: [],
            isVerified: false
        });
        await newUser.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser._id,
                    userName: newUser.userName,
                    email: newUser.email,
                    role: newUser.role,
                    points: newUser.points
                },
                token
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.registerUser = registerUser;
// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                    role: user.role,
                    points: user.points,
                    avatar: user.avatar,
                    stats: user.stats
                },
                token
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.loginUser = loginUser;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await User_1.default.find()
            .select('-password -otp -token')
            .populate('itemId', 'itemName itemType itemPrice')
            .populate('houseDecorId', 'houseName houseDescription')
            .populate('gameChallengeId', 'title difficulty rewardPoints')
            .populate('matchId', 'status winner')
            .populate('certId', 'certName certDescription')
            .populate('listFriend', 'userName avatar points')
            .skip(skip)
            .limit(limit)
            .sort({ points: -1 });
        const total = await User_1.default.countDocuments();
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalUsers: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllUsers = getAllUsers;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id)
            .select('-password -otp -token')
            .populate('itemId', 'itemName itemType itemPrice itemImage')
            .populate('houseDecorId', 'houseName houseDescription')
            .populate('gameChallengeId', 'title difficulty rewardPoints')
            .populate('matchId', 'status winner loser')
            .populate('certId', 'certName certDescription')
            .populate('listFriend', 'userName avatar points stats');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserById = getUserById;
// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Remove sensitive fields
        delete updateData.password;
        delete updateData.email;
        delete updateData.otp;
        delete updateData.token;
        const user = await User_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password -otp -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteUser = deleteUser;
// Add friend
const addFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const user = await User_1.default.findById(userId);
        const friend = await User_1.default.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({
                success: false,
                message: 'User or friend not found'
            });
        }
        if (user.listFriend.includes(friendId)) {
            return res.status(400).json({
                success: false,
                message: 'Friend already added'
            });
        }
        user.listFriend.push(friendId);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Friend added successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.addFriend = addFriend;
// Update user points
const updateUserPoints = async (req, res) => {
    try {
        const { id } = req.params;
        const { points } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { $inc: { points } }, { new: true }).select('-password -otp -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Points updated successfully',
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateUserPoints = updateUserPoints;
//# sourceMappingURL=userController.js.map