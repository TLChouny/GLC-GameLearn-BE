import { Request, Response } from 'express';
import GameChallenge from '../models/GameChallenge';
import Match from '../models/Match';
import User from '../models/User';
import Certificate from '../models/Certificate';

// Game Challenge Controllers
export const createGameChallenge = async (req: Request, res: Response) => {
  try {
    const { title, subjectId, difficulty, rewardPoints } = req.body;

    const gameChallenge = new GameChallenge({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllGameChallenges = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const difficulty = req.query.difficulty as string;

    const filter: any = {};
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const gameChallenges = await GameChallenge.find(filter)
      .populate('subjectId', 'subjectName subjectDescription subjectUnit')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await GameChallenge.countDocuments(filter);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Match Controllers
export const createMatch = async (req: Request, res: Response) => {
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
    const gameChallenge = await GameChallenge.findById(gameChallengeId);
    if (!gameChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Game challenge not found'
      });
    }

    const match = new Match({
      players,
      gameChallengeId,
      status: 'waiting'
    });

    await match.save();

    // Update users with match reference
    await User.updateMany(
      { _id: { $in: players } },
      { $push: { matchId: match._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: { match }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateMatchStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, winner, loser } = req.body;

    const match = await Match.findByIdAndUpdate(
      id,
      { status, winner, loser },
      { new: true }
    ).populate('players', 'userName points')
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
      const gameChallenge = await GameChallenge.findById(match.gameChallengeId);
      if (gameChallenge) {
        await User.findByIdAndUpdate(
          winner,
          { 
            $inc: { 
              points: gameChallenge.rewardPoints,
              'stats.gamesWon': 1
            }
          }
        );
        // Update all players' games played count
        await User.updateMany(
          { _id: { $in: match.players } },
          { $inc: { 'stats.gamesPlayed': 1 } }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Match status updated successfully',
      data: { match }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id)
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserMatches = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ players: userId })
      .populate('players', 'userName avatar')
      .populate('gameChallengeId', 'title difficulty rewardPoints')
      .populate('winner', 'userName')
      .populate('loser', 'userName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Match.countDocuments({ players: userId });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Certificate Controllers
export const createCertificate = async (req: Request, res: Response) => {
  try {
    const { certName, certDescription, gameChallengeId, matchId } = req.body;

    const certificate = new Certificate({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get user's matches
    const userMatches = await Match.find({ players: userId });
    const matchIds = userMatches.map(match => match._id);

    // Get certificates for user's matches
    const certificates = await Certificate.find({ matchId: { $in: matchIds } })
      .populate('gameChallengeId', 'title difficulty')
      .populate('matchId', 'status winner');

    res.status(200).json({
      success: true,
      data: { certificates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
