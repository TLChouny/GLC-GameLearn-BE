"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCertificates = exports.createCertificate = exports.getUserMatches = exports.getMatchById = exports.updateMatchStatus = exports.createMatch = exports.getAllGameChallenges = exports.createGameChallenge = void 0;
const GameChallenge_1 = __importDefault(require("../models/GameChallenge"));
const Match_1 = __importDefault(require("../models/Match"));
const User_1 = __importDefault(require("../models/User"));
const Certificate_1 = __importDefault(require("../models/Certificate"));
// Game Challenge Controllers
const createGameChallenge = async (req, res) => {
    try {
        const { title, subjectId, difficulty, rewardPoints } = req.body;
        const gameChallenge = new GameChallenge_1.default({
            title,
            subjectId,
            difficulty,
            rewardPoints
        });
        await gameChallenge.save();
        res.status(201).json({
            success: true,
            message: 'Game challenge created successfully',
            data: { gameChallenge }
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
exports.createGameChallenge = createGameChallenge;
const getAllGameChallenges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const difficulty = req.query.difficulty;
        const filter = {};
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        const gameChallenges = await GameChallenge_1.default.find(filter)
            .populate('subjectId', 'subjectName subjectDescription subjectUnit')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await GameChallenge_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                gameChallenges,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalChallenges: total,
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
exports.getAllGameChallenges = getAllGameChallenges;
// Match Controllers
const createMatch = async (req, res) => {
    try {
        const { players, gameChallengeId } = req.body;
        // Validate players
        if (!players || players.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'At least 2 players required for a match'
            });
        }
        // Check if game challenge exists
        const gameChallenge = await GameChallenge_1.default.findById(gameChallengeId);
        if (!gameChallenge) {
            return res.status(404).json({
                success: false,
                message: 'Game challenge not found'
            });
        }
        const match = new Match_1.default({
            players,
            gameChallengeId,
            status: 'waiting'
        });
        await match.save();
        // Update users with match reference
        await User_1.default.updateMany({ _id: { $in: players } }, { $push: { matchId: match._id } });
        res.status(201).json({
            success: true,
            message: 'Match created successfully',
            data: { match }
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
exports.createMatch = createMatch;
const updateMatchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, winner, loser } = req.body;
        const match = await Match_1.default.findByIdAndUpdate(id, { status, winner, loser }, { new: true }).populate('players', 'userName points')
            .populate('gameChallengeId', 'title rewardPoints')
            .populate('winner', 'userName points')
            .populate('loser', 'userName points');
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        // If match is completed, award points to winner
        if (status === 'completed' && winner) {
            const gameChallenge = await GameChallenge_1.default.findById(match.gameChallengeId);
            if (gameChallenge) {
                await User_1.default.findByIdAndUpdate(winner, {
                    $inc: {
                        points: gameChallenge.rewardPoints,
                        'stats.gamesWon': 1
                    }
                });
                // Update all players' games played count
                await User_1.default.updateMany({ _id: { $in: match.players } }, { $inc: { 'stats.gamesPlayed': 1 } });
            }
        }
        res.status(200).json({
            success: true,
            message: 'Match status updated successfully',
            data: { match }
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
exports.updateMatchStatus = updateMatchStatus;
const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match_1.default.findById(id)
            .populate('players', 'userName avatar points stats')
            .populate('gameChallengeId', 'title difficulty rewardPoints')
            .populate('winner', 'userName avatar')
            .populate('loser', 'userName avatar');
        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }
        res.status(200).json({
            success: true,
            data: { match }
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
exports.getMatchById = getMatchById;
const getUserMatches = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const matches = await Match_1.default.find({ players: userId })
            .populate('players', 'userName avatar')
            .populate('gameChallengeId', 'title difficulty rewardPoints')
            .populate('winner', 'userName')
            .populate('loser', 'userName')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Match_1.default.countDocuments({ players: userId });
        res.status(200).json({
            success: true,
            data: {
                matches,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalMatches: total,
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
exports.getUserMatches = getUserMatches;
// Certificate Controllers
const createCertificate = async (req, res) => {
    try {
        const { certName, certDescription, gameChallengeId, matchId } = req.body;
        const certificate = new Certificate_1.default({
            certName,
            certDescription,
            gameChallengeId,
            matchId
        });
        await certificate.save();
        res.status(201).json({
            success: true,
            message: 'Certificate created successfully',
            data: { certificate }
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
exports.createCertificate = createCertificate;
const getUserCertificates = async (req, res) => {
    try {
        const { userId } = req.params;
        // Get user's matches
        const userMatches = await Match_1.default.find({ players: userId });
        const matchIds = userMatches.map(match => match._id);
        // Get certificates for user's matches
        const certificates = await Certificate_1.default.find({ matchId: { $in: matchIds } })
            .populate('gameChallengeId', 'title difficulty')
            .populate('matchId', 'status winner');
        res.status(200).json({
            success: true,
            data: { certificates }
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
exports.getUserCertificates = getUserCertificates;
//# sourceMappingURL=gameController.js.map