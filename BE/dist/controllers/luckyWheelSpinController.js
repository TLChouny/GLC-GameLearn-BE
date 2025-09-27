"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWheelInfo = exports.getUserSpinStats = exports.getUserSpinHistory = exports.spinLuckyWheel = void 0;
const LuckyWheel_1 = __importDefault(require("../models/LuckyWheel"));
const LuckyWheelPrize_1 = __importDefault(require("../models/LuckyWheelPrize"));
const LuckyWheelSpin_1 = __importDefault(require("../models/LuckyWheelSpin"));
const LuckyWheelDailyBonus_1 = __importDefault(require("../models/LuckyWheelDailyBonus"));
const User_1 = __importDefault(require("../models/User"));
// Kiểm tra số lượt quay còn lại trong ngày
const checkDailySpinLimit = async (userId, wheelId, maxSpinPerDay) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySpins = await LuckyWheelSpin_1.default.countDocuments({
        userId,
        wheelId,
        createdAt: { $gte: today }
    });
    const dateKey = today.toISOString().slice(0, 10);
    const bonus = await LuckyWheelDailyBonus_1.default.findOne({ userId, wheelId, dateKey });
    const totalLimit = maxSpinPerDay + (bonus?.bonusSpins || 0);
    return todaySpins < totalLimit;
};
// Logic quay vòng quay
const spinWheel = (prizes) => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    for (const prize of prizes) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
            return prize;
        }
    }
    // Fallback: trả về giải thưởng cuối cùng nếu có lỗi
    return prizes[prizes.length - 1];
};
// Spin Lucky Wheel
const spinLuckyWheel = async (req, res) => {
    try {
        const { wheelId } = req.params;
        const userId = req.user?.id; // Từ middleware auth
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        // Kiểm tra vòng quay có tồn tại không
        const luckyWheel = await LuckyWheel_1.default.findById(wheelId);
        if (!luckyWheel) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel not found'
            });
        }
        // Kiểm tra giới hạn quay trong ngày
        const canSpin = await checkDailySpinLimit(userId, wheelId, luckyWheel.maxSpinPerDay);
        if (!canSpin) {
            return res.status(400).json({
                success: false,
                message: `You have reached the daily spin limit of ${luckyWheel.maxSpinPerDay} spins`
            });
        }
        // Lấy danh sách giải thưởng
        const prizes = await LuckyWheelPrize_1.default.find({ wheelId });
        if (prizes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No prizes available for this wheel'
            });
        }
        // Chuẩn hóa xác suất về tổng 100 nếu dữ liệu không đúng 100
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        if (totalProbability <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid prize probabilities'
            });
        }
        const normalizedPrizes = Math.abs(totalProbability - 100) > 0.01
            ? prizes.map((p) => ({
                ...(typeof p.toObject === 'function' ? p.toObject() : p),
                probability: (p.probability * 100) / totalProbability
            }))
            : prizes;
        // Thực hiện quay với xác suất đã chuẩn hóa
        const winningPrize = spinWheel(normalizedPrizes);
        // Lưu kết quả quay
        const spinResult = new LuckyWheelSpin_1.default({
            wheelId,
            userId,
            prizeId: winningPrize._id,
            spinResult: `Won: ${winningPrize.prizeName} (${winningPrize.prizeType})`
        });
        await spinResult.save();
        // Cập nhật điểm/items hoặc bonus cho user nếu cần
        let bonusAdded = 0;
        if (winningPrize.prizeType === 'points') {
            await User_1.default.findByIdAndUpdate(userId, {
                $inc: { points: winningPrize.prizeValue }
            });
        }
        else if (winningPrize.prizeType === 'item' && winningPrize.itemId) {
            await User_1.default.findByIdAndUpdate(userId, {
                $addToSet: { itemId: winningPrize.itemId }
            });
        }
        else if (winningPrize.prizeType === 'special' && winningPrize.prizeName === 'THÊM LƯỢT') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateKey = today.toISOString().slice(0, 10);
            await LuckyWheelDailyBonus_1.default.findOneAndUpdate({ userId, wheelId, dateKey }, { $inc: { bonusSpins: 2 } }, { upsert: true, new: true });
            bonusAdded = 2;
        }
        // Tính remainingSpins sau quay (có bonus)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const dateKeyAfter = startOfDay.toISOString().slice(0, 10);
        const todaySpinsAfter = await LuckyWheelSpin_1.default.countDocuments({ userId, wheelId, createdAt: { $gte: startOfDay } });
        const bonusAfter = await LuckyWheelDailyBonus_1.default.findOne({ userId, wheelId, dateKey: dateKeyAfter });
        const totalLimitAfter = luckyWheel.maxSpinPerDay + (bonusAfter?.bonusSpins || 0);
        const remainingSpinsAfter = Math.max(0, totalLimitAfter - todaySpinsAfter);
        res.status(200).json({
            success: true,
            message: 'Spin completed successfully',
            data: {
                spinResult: spinResult.spinResult,
                prizeId: winningPrize._id,
                prize: {
                    name: winningPrize.prizeName,
                    type: winningPrize.prizeType,
                    value: winningPrize.prizeValue,
                    itemId: winningPrize.itemId
                },
                ...(bonusAdded > 0 ? { bonusAdded } : {}),
                remainingSpins: remainingSpinsAfter
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
exports.spinLuckyWheel = spinLuckyWheel;
// Lấy lịch sử quay của user
const getUserSpinHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { wheelId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const filter = { userId };
        if (wheelId) {
            filter.wheelId = wheelId;
        }
        const spinHistory = await LuckyWheelSpin_1.default.find(filter)
            .populate('wheelId', 'wheelTitle wheelDescription')
            .populate('prizeId', 'prizeName prizeType prizeValue itemId')
            .populate('prizeId.itemId', 'itemName itemType itemPrice itemImage')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await LuckyWheelSpin_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                spinHistory,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalSpins: total,
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
exports.getUserSpinHistory = getUserSpinHistory;
// Lấy thống kê quay của user
const getUserSpinStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { wheelId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const filter = { userId };
        if (wheelId) {
            filter.wheelId = wheelId;
        }
        // Thống kê tổng quan
        const totalSpins = await LuckyWheelSpin_1.default.countDocuments(filter);
        // Thống kê theo loại giải thưởng
        const prizeStats = await LuckyWheelSpin_1.default.aggregate([
            { $match: filter },
            { $lookup: { from: 'luckywheelprizes', localField: 'prizeId', foreignField: '_id', as: 'prize' } },
            { $unwind: '$prize' },
            { $group: { _id: '$prize.prizeType', count: { $sum: 1 } } }
        ]);
        // Thống kê theo vòng quay
        const wheelStats = await LuckyWheelSpin_1.default.aggregate([
            { $match: filter },
            { $lookup: { from: 'luckywheels', localField: 'wheelId', foreignField: '_id', as: 'wheel' } },
            { $unwind: '$wheel' },
            { $group: { _id: '$wheelId', wheelTitle: { $first: '$wheel.wheelTitle' }, count: { $sum: 1 } } }
        ]);
        // Lượt quay hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySpins = await LuckyWheelSpin_1.default.countDocuments({
            ...filter,
            createdAt: { $gte: today }
        });
        res.status(200).json({
            success: true,
            data: {
                totalSpins,
                todaySpins,
                prizeStats,
                wheelStats
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
exports.getUserSpinStats = getUserSpinStats;
// Lấy thông tin vòng quay với số lượt quay còn lại
const getWheelInfo = async (req, res) => {
    try {
        const { wheelId } = req.params;
        const userId = req.user?.id;
        const luckyWheel = await LuckyWheel_1.default.findById(wheelId);
        if (!luckyWheel) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel not found'
            });
        }
        // Lấy danh sách giải thưởng
        const prizes = await LuckyWheelPrize_1.default.find({ wheelId })
            .populate('itemId', 'itemName itemType itemPrice itemImage')
            .sort({ probability: -1 });
        let remainingSpins = 0;
        if (userId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todaySpins = await LuckyWheelSpin_1.default.countDocuments({
                userId,
                wheelId,
                createdAt: { $gte: today }
            });
            const dateKey = today.toISOString().slice(0, 10);
            const bonus = await LuckyWheelDailyBonus_1.default.findOne({ userId, wheelId, dateKey });
            const totalLimit = luckyWheel.maxSpinPerDay + (bonus?.bonusSpins || 0);
            remainingSpins = Math.max(0, totalLimit - todaySpins);
        }
        res.status(200).json({
            success: true,
            data: {
                wheel: luckyWheel,
                prizes,
                remainingSpins,
                canSpin: remainingSpins > 0
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
exports.getWheelInfo = getWheelInfo;
//# sourceMappingURL=luckyWheelSpinController.js.map