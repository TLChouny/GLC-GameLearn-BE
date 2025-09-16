import express from 'express';
import {
  updateRanking,
  getRankingsBySeason,
  getTopRankings,
  getUserRanking,
  getAllSeasons,
  updateAllRankings
} from '../controllers/rankingController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Ranking routes
router.post('/update', authenticateToken, updateRanking);
router.get('/season/:season', getRankingsBySeason);
router.get('/top/:season', getTopRankings);
router.get('/user/:userId/season/:season', getUserRanking);
router.get('/seasons', getAllSeasons);
router.post('/update-all', authenticateToken, updateAllRankings);

export default router;
