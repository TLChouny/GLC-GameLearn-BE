"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLuckyWheelPrize = exports.updateLuckyWheelPrize = exports.getLuckyWheelPrizes = exports.createLuckyWheelPrize = exports.deleteLuckyWheel = exports.updateLuckyWheel = exports.getLuckyWheelById = exports.getAllLuckyWheels = exports.createLuckyWheel = void 0;
const LuckyWheel_1 = __importDefault(require("../models/LuckyWheel"));
const LuckyWheelPrize_1 = __importDefault(require("../models/LuckyWheelPrize"));
const LuckyWheelSpin_1 = __importDefault(require("../models/LuckyWheelSpin"));
// LuckyWheel Controllers
const createLuckyWheel = async (req, res) => {
    try {
        const { wheelTitle, wheelDescription, maxSpinPerDay } = req.body;
        const luckyWheel = new LuckyWheel_1.default({
            wheelTitle,
            wheelDescription,
            maxSpinPerDay: maxSpinPerDay || 3
        });
        await luckyWheel.save();
        res.status(201).json({
            success: true,
            message: 'Lucky wheel created successfully',
            data: { luckyWheel }
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
exports.createLuckyWheel = createLuckyWheel;
const getAllLuckyWheels = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const luckyWheels = await LuckyWheel_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await LuckyWheel_1.default.countDocuments();
        res.status(200).json({
            success: true,
            data: {
                luckyWheels,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalWheels: total,
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
exports.getAllLuckyWheels = getAllLuckyWheels;
const getLuckyWheelById = async (req, res) => {
    try {
        const { id } = req.params;
        const luckyWheel = await LuckyWheel_1.default.findById(id);
        if (!luckyWheel) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel not found'
            });
        }
        res.status(200).json({
            success: true,
            data: { luckyWheel }
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
exports.getLuckyWheelById = getLuckyWheelById;
const updateLuckyWheel = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const luckyWheel = await LuckyWheel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!luckyWheel) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lucky wheel updated successfully',
            data: { luckyWheel }
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
exports.updateLuckyWheel = updateLuckyWheel;
const deleteLuckyWheel = async (req, res) => {
    try {
        const { id } = req.params;
        // Xóa tất cả prizes và spins liên quan
        await LuckyWheelPrize_1.default.deleteMany({ wheelId: id });
        await LuckyWheelSpin_1.default.deleteMany({ wheelId: id });
        const luckyWheel = await LuckyWheel_1.default.findByIdAndDelete(id);
        if (!luckyWheel) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lucky wheel and all related data deleted successfully'
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
exports.deleteLuckyWheel = deleteLuckyWheel;
// LuckyWheelPrize Controllers
const createLuckyWheelPrize = async (req, res) => {
    try {
        const { wheelId, itemId, prizeName, prizeType, prizeValue, probability } = req.body;
        // Kiểm tra tổng probability không vượt quá 100
        const existingPrizes = await LuckyWheelPrize_1.default.find({ wheelId });
        const totalProbability = existingPrizes.reduce((sum, prize) => sum + prize.probability, 0);
        if (totalProbability + probability > 100) {
            return res.status(400).json({
                success: false,
                message: 'Total probability cannot exceed 100%'
            });
        }
        const luckyWheelPrize = new LuckyWheelPrize_1.default({
            wheelId,
            itemId,
            prizeName,
            prizeType,
            prizeValue,
            probability
        });
        await luckyWheelPrize.save();
        res.status(201).json({
            success: true,
            message: 'Lucky wheel prize created successfully',
            data: { luckyWheelPrize }
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
exports.createLuckyWheelPrize = createLuckyWheelPrize;
const getLuckyWheelPrizes = async (req, res) => {
    try {
        const { wheelId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const prizes = await LuckyWheelPrize_1.default.find({ wheelId })
            .populate('itemId', 'itemName itemType itemPrice itemImage')
            .skip(skip)
            .limit(limit)
            .sort({ probability: -1 });
        const total = await LuckyWheelPrize_1.default.countDocuments({ wheelId });
        res.status(200).json({
            success: true,
            data: {
                prizes,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalPrizes: total,
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
exports.getLuckyWheelPrizes = getLuckyWheelPrizes;
const updateLuckyWheelPrize = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Nếu cập nhật probability, kiểm tra tổng không vượt quá 100
        if (updateData.probability) {
            const prize = await LuckyWheelPrize_1.default.findById(id);
            if (prize) {
                const existingPrizes = await LuckyWheelPrize_1.default.find({
                    wheelId: prize.wheelId,
                    _id: { $ne: id }
                });
                const totalProbability = existingPrizes.reduce((sum, p) => sum + p.probability, 0);
                if (totalProbability + updateData.probability > 100) {
                    return res.status(400).json({
                        success: false,
                        message: 'Total probability cannot exceed 100%'
                    });
                }
            }
        }
        const luckyWheelPrize = await LuckyWheelPrize_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!luckyWheelPrize) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel prize not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lucky wheel prize updated successfully',
            data: { luckyWheelPrize }
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
exports.updateLuckyWheelPrize = updateLuckyWheelPrize;
const deleteLuckyWheelPrize = async (req, res) => {
    try {
        const { id } = req.params;
        const luckyWheelPrize = await LuckyWheelPrize_1.default.findByIdAndDelete(id);
        if (!luckyWheelPrize) {
            return res.status(404).json({
                success: false,
                message: 'Lucky wheel prize not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lucky wheel prize deleted successfully'
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
exports.deleteLuckyWheelPrize = deleteLuckyWheelPrize;
//# sourceMappingURL=luckyWheelController.js.map