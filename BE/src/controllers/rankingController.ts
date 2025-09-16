import { Request, Response } from 'express';
import Ranking from '../models/Ranking';
import User from '../models/User';

// Create or update ranking
export const updateRanking = async (req: Request, res: Response) => {
  try {
    const { userId, totalPoints, season } = req.body;

    // Check if ranking already exists for this user and season
    let ranking = await Ranking.findOne({ userId, season });

    if (ranking) {
      // Update existing ranking
      ranking.totalPoints = totalPoints;
      await ranking.save();
    } else {
      // Create new ranking
      ranking = new Ranking({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get rankings by season
export const getRankingsBySeason = async (req: Request, res: Response) => {
  try {
    const { season } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const rankings = await Ranking.find({ season })
      .populate('userId', 'userName avatar points stats')
      .skip(skip)
      .limit(limit)
      .sort({ rank: 1 });

    const total = await Ranking.countDocuments({ season });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get top rankings
export const getTopRankings = async (req: Request, res: Response) => {
  try {
    const { season } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const rankings = await Ranking.find({ season })
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user's ranking
export const getUserRanking = async (req: Request, res: Response) => {
  try {
    const { userId, season } = req.params;

    const ranking = await Ranking.findOne({ userId, season })
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all seasons
export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await Ranking.distinct('season');
    
    res.status(200).json({
      success: true,
      data: { seasons }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper function to calculate ranks
const calculateRanks = async (season: string) => {
  try {
    // Get all rankings for the season sorted by totalPoints descending
    const rankings = await Ranking.find({ season })
      .sort({ totalPoints: -1 });

    // Update ranks
    for (let i = 0; i < rankings.length; i++) {
      rankings[i].rank = i + 1;
      await rankings[i].save();
    }
  } catch (error) {
    console.error('Error calculating ranks:', error);
  }
};

// Auto-update rankings based on user points
export const updateAllRankings = async (req: Request, res: Response) => {
  try {
    const { season } = req.body;

    // Get all users
    const users = await User.find().select('_id points');

    // Update rankings for all users
    for (const user of users) {
      await updateRanking({
        body: {
          userId: user._id,
          totalPoints: user.points,
          season
        }
      } as Request, res);
    }

    res.status(200).json({
      success: true,
      message: 'All rankings updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
