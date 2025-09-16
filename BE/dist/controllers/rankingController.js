"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllRankings = exports.getAllSeasons = exports.getUserRanking = exports.getTopRankings = exports.getRankingsBySeason = exports.updateRanking = void 0;
const Ranking_1 = __importDefault(require("../models/Ranking"));
const User_1 = __importDefault(require("../models/User"));
// Create or update ranking
const updateRanking = async (req, res) => {
    try {
        const { userId, totalPoints, season } = req.body;
        // Check if ranking already exists for this user and season
        let ranking = await Ranking_1.default.findOne({ userId, season });
        if (ranking) {
            // Update existing ranking
            ranking.totalPoints = totalPoints;
            await ranking.save();
        }
        else {
            // Create new ranking
            ranking = new Ranking_1.default({
                userId,
                totalPoints,
                season,
                rank: 0 // Will be calculated after
            });
            await ranking.save();
        }
        // Recalculate ranks for this season
        await calculateRanks(season);
        res.status(200).json({
            success: true,
            message: 'Ranking updated successfully',
            data: { ranking }
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
exports.updateRanking = updateRanking;
// Get rankings by season
const getRankingsBySeason = async (req, res) => {
    try {
        const { season } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const rankings = await Ranking_1.default.find({ season })
            .populate('userId', 'userName avatar points stats')
            .skip(skip)
            .limit(limit)
            .sort({ rank: 1 });
        const total = await Ranking_1.default.countDocuments({ season });
        res.status(200).json({
            success: true,
            data: {
                rankings,
                season,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalRankings: total,
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
exports.getRankingsBySeason = getRankingsBySeason;
// Get top rankings
const getTopRankings = async (req, res) => {
    try {
        const { season } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const rankings = await Ranking_1.default.find({ season })
            .populate('userId', 'userName avatar points stats')
            .limit(limit)
            .sort({ rank: 1 });
        res.status(200).json({
            success: true,
            data: {
                rankings,
                season,
                topCount: rankings.length
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
exports.getTopRankings = getTopRankings;
// Get user's ranking
const getUserRanking = async (req, res) => {
    try {
        const { userId, season } = req.params;
        const ranking = await Ranking_1.default.findOne({ userId, season })
            .populate('userId', 'userName avatar points stats');
        if (!ranking) {
            return res.status(404).json({
                success: false,
                message: 'Ranking not found for this user and season'
            });
        }
        res.status(200).json({
            success: true,
            data: { ranking }
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
exports.getUserRanking = getUserRanking;
// Get all seasons
const getAllSeasons = async (req, res) => {
    try {
        const seasons = await Ranking_1.default.distinct('season');
        res.status(200).json({
            success: true,
            data: { seasons }
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
exports.getAllSeasons = getAllSeasons;
// Helper function to calculate ranks
const calculateRanks = async (season) => {
    try {
        // Get all rankings for the season sorted by totalPoints descending
        const rankings = await Ranking_1.default.find({ season })
            .sort({ totalPoints: -1 });
        // Update ranks
        for (let i = 0; i < rankings.length; i++) {
            rankings[i].rank = i + 1;
            await rankings[i].save();
        }
    }
    catch (error) {
        console.error('Error calculating ranks:', error);
    }
};
// Auto-update rankings based on user points
const updateAllRankings = async (req, res) => {
    try {
        const { season } = req.body;
        // Get all users
        const users = await User_1.default.find().select('_id points');
        // Update rankings for all users
        for (const user of users) {
            await (0, exports.updateRanking)({
                body: {
                    userId: user._id,
                    totalPoints: user.points,
                    season
                }
            }, res);
        }
        res.status(200).json({
            success: true,
            message: 'All rankings updated successfully'
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
exports.updateAllRankings = updateAllRankings;
//# sourceMappingURL=rankingController.js.map