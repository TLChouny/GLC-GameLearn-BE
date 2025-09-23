"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuckyWheelService = void 0;
const LuckyWheel_1 = __importDefault(require("../models/LuckyWheel"));
const LuckyWheelPrize_1 = __importDefault(require("../models/LuckyWheelPrize"));
const LuckyWheelSpin_1 = __importDefault(require("../models/LuckyWheelSpin"));
const User_1 = __importDefault(require("../models/User"));
class LuckyWheelService {
    // Kiểm tra tính hợp lệ của vòng quay
    static async validateWheel(wheelId) {
        const wheel = await LuckyWheel_1.default.findById(wheelId);
        if (!wheel) {
            return { isValid: false, message: 'Lucky wheel not found' };
        }
        const prizes = await LuckyWheelPrize_1.default.find({ wheelId });
        if (prizes.length === 0) {
            return { isValid: false, message: 'No prizes available for this wheel' };
        }
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        if (Math.abs(totalProbability - 100) > 0.01) {
            return { isValid: false, message: 'Prize probabilities must sum to 100%' };
        }
        return { isValid: true };
    }
    // Kiểm tra giới hạn quay trong ngày
    static async checkDailySpinLimit(userId, wheelId) {
        const wheel = await LuckyWheel_1.default.findById(wheelId);
        if (!wheel) {
            return { canSpin: false, remainingSpins: 0, message: 'Lucky wheel not found' };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySpins = await LuckyWheelSpin_1.default.countDocuments({
            userId,
            wheelId,
            createdAt: { $gte: today }
        });
        const remainingSpins = Math.max(0, wheel.maxSpinPerDay - todaySpins);
        const canSpin = remainingSpins > 0;
        return {
            canSpin,
            remainingSpins,
            message: canSpin ? undefined : `You have reached the daily spin limit of ${wheel.maxSpinPerDay} spins`
        };
    }
    // Thực hiện quay vòng quay
    static async performSpin(userId, wheelId) {
        try {
            // Kiểm tra tính hợp lệ của vòng quay
            const wheelValidation = await this.validateWheel(wheelId);
            if (!wheelValidation.isValid) {
                return { success: false, message: wheelValidation.message };
            }
            // Kiểm tra giới hạn quay
            const spinLimitCheck = await this.checkDailySpinLimit(userId, wheelId);
            if (!spinLimitCheck.canSpin) {
                return { success: false, message: spinLimitCheck.message };
            }
            // Lấy danh sách giải thưởng
            const prizes = await LuckyWheelPrize_1.default.find({ wheelId });
            const winningPrize = this.calculateWinningPrize(prizes);
            // Lưu kết quả quay
            const spinResult = new LuckyWheelSpin_1.default({
                wheelId,
                userId,
                prizeId: winningPrize._id,
                spinResult: `Won: ${winningPrize.prizeName} (${winningPrize.prizeType})`
            });
            await spinResult.save();
            // Cập nhật phần thưởng cho user
            await this.applyPrizeToUser(userId, winningPrize);
            // Lấy thông tin cập nhật về lượt quay còn lại
            const updatedSpinLimit = await this.checkDailySpinLimit(userId, wheelId);
            return {
                success: true,
                data: {
                    spinResult: spinResult.spinResult,
                    prize: {
                        name: winningPrize.prizeName,
                        type: winningPrize.prizeType,
                        value: winningPrize.prizeValue,
                        itemId: winningPrize.itemId
                    },
                    remainingSpins: updatedSpinLimit.remainingSpins
                }
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    // Tính toán giải thưởng thắng
    static calculateWinningPrize(prizes) {
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        for (const prize of prizes) {
            cumulativeProbability += prize.probability;
            if (random <= cumulativeProbability) {
                return prize;
            }
        }
        // Fallback: trả về giải thưởng cuối cùng
        return prizes[prizes.length - 1];
    }
    // Áp dụng phần thưởng cho user
    static async applyPrizeToUser(userId, prize) {
        switch (prize.prizeType) {
            case 'points':
                await User_1.default.findByIdAndUpdate(userId, {
                    $inc: { points: prize.prizeValue }
                });
                break;
            case 'item':
                if (prize.itemId) {
                    await User_1.default.findByIdAndUpdate(userId, {
                        $addToSet: { itemId: prize.itemId }
                    });
                }
                break;
            case 'coins':
                // Giả sử coins được lưu trong trường points hoặc tạo trường riêng
                await User_1.default.findByIdAndUpdate(userId, {
                    $inc: { points: prize.prizeValue }
                });
                break;
            case 'special':
                // Xử lý các phần thưởng đặc biệt
                // Có thể thêm logic tùy chỉnh ở đây
                break;
            default:
                console.warn(`Unknown prize type: ${prize.prizeType}`);
        }
    }
    // Lấy thống kê chi tiết của vòng quay
    static async getWheelStatistics(wheelId) {
        const wheel = await LuckyWheel_1.default.findById(wheelId);
        if (!wheel) {
            throw new Error('Lucky wheel not found');
        }
        // Thống kê tổng quan
        const totalSpins = await LuckyWheelSpin_1.default.countDocuments({ wheelId });
        // Thống kê theo giải thưởng
        const prizeStats = await LuckyWheelSpin_1.default.aggregate([
            { $match: { wheelId: wheel._id } },
            { $lookup: { from: 'luckywheelprizes', localField: 'prizeId', foreignField: '_id', as: 'prize' } },
            { $unwind: '$prize' },
            { $group: {
                    _id: '$prize._id',
                    prizeName: { $first: '$prize.prizeName' },
                    prizeType: { $first: '$prize.prizeType' },
                    count: { $sum: 1 },
                    probability: { $first: '$prize.probability' }
                } },
            { $sort: { count: -1 } }
        ]);
        // Thống kê theo ngày
        const dailyStats = await LuckyWheelSpin_1.default.aggregate([
            { $match: { wheelId: wheel._id } },
            { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                } },
            { $sort: { _id: -1 } },
            { $limit: 30 }
        ]);
        // Thống kê theo user
        const userStats = await LuckyWheelSpin_1.default.aggregate([
            { $match: { wheelId: wheel._id } },
            { $group: {
                    _id: '$userId',
                    totalSpins: { $sum: 1 }
                } },
            { $sort: { totalSpins: -1 } },
            { $limit: 10 }
        ]);
        return {
            wheel,
            totalSpins,
            prizeStats,
            dailyStats,
            topUsers: userStats
        };
    }
    // Reset giới hạn quay hàng ngày (có thể dùng cho admin)
    static async resetDailySpins(wheelId) {
        // Logic để reset giới hạn quay nếu cần
        // Có thể thêm logic phức tạp hơn ở đây
    }
    // Tạo vòng quay mẫu với giải thưởng mặc định
    static async createSampleWheel() {
        const sampleWheel = new LuckyWheel_1.default({
            wheelTitle: 'Daily Lucky Wheel',
            wheelDescription: 'Spin daily to win amazing prizes!',
            maxSpinPerDay: 3
        });
        await sampleWheel.save();
        // Tạo các giải thưởng mẫu
        const samplePrizes = [
            {
                wheelId: sampleWheel._id,
                prizeName: '10 Points',
                prizeType: 'points',
                prizeValue: 10,
                probability: 40
            },
            {
                wheelId: sampleWheel._id,
                prizeName: '25 Points',
                prizeType: 'points',
                prizeValue: 25,
                probability: 30
            },
            {
                wheelId: sampleWheel._id,
                prizeName: '50 Points',
                prizeType: 'points',
                prizeValue: 50,
                probability: 20
            },
            {
                wheelId: sampleWheel._id,
                prizeName: '100 Points',
                prizeType: 'points',
                prizeValue: 100,
                probability: 10
            }
        ];
        for (const prizeData of samplePrizes) {
            const prize = new LuckyWheelPrize_1.default(prizeData);
            await prize.save();
        }
        return sampleWheel;
    }
}
exports.LuckyWheelService = LuckyWheelService;
//# sourceMappingURL=luckyWheelService.js.map