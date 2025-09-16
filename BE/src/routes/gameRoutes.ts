import express from 'express';
import {
  createGameChallenge,
  getAllGameChallenges,
  createMatch,
  updateMatchStatus,
  getMatchById,
  getUserMatches,
  createCertificate,
  getUserCertificates
} from '../controllers/gameController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Game Challenge routes
router.post('/challenges', authenticateToken, createGameChallenge);
router.get('/challenges', getAllGameChallenges);

// Match routes
router.post('/matches', authenticateToken, createMatch);
router.put('/matches/:id/status', authenticateToken, updateMatchStatus);
router.get('/matches/:id', authenticateToken, getMatchById);
router.get('/users/:userId/matches', authenticateToken, getUserMatches);

// Certificate routes
router.post('/certificates', authenticateToken, createCertificate);
router.get('/users/:userId/certificates', authenticateToken, getUserCertificates);

export default router;
