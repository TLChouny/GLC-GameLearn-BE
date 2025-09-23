import express from 'express';
import {
  createLuckyWheel,
  getAllLuckyWheels,
  getLuckyWheelById,
  updateLuckyWheel,
  deleteLuckyWheel,
  createLuckyWheelPrize,
  getLuckyWheelPrizes,
  updateLuckyWheelPrize,
  deleteLuckyWheelPrize
} from '../controllers/luckyWheelController';
import {
  spinLuckyWheel,
  getUserSpinHistory,
  getUserSpinStats,
  getWheelInfo
} from '../controllers/luckyWheelSpinController';
import { authenticateToken } from '../middlewares/auth';
import {
  validateCreateLuckyWheel,
  validateUpdateLuckyWheel,
  validateCreateLuckyWheelPrize,
  validateUpdateLuckyWheelPrize,
  validateSpinLuckyWheel,
  validateQueryParams,
  validateIdParam,
  validateWheelIdParam
} from '../middlewares/luckyWheelValidation';

const router = express.Router();

// LuckyWheel CRUD routes
router.post('/', authenticateToken, validateCreateLuckyWheel, createLuckyWheel);
router.get('/', validateQueryParams, getAllLuckyWheels);
router.get('/:id', validateIdParam, getLuckyWheelById);
router.put('/:id', authenticateToken, validateUpdateLuckyWheel, updateLuckyWheel);
router.delete('/:id', authenticateToken, validateIdParam, deleteLuckyWheel);

// LuckyWheelPrize routes
router.post('/:wheelId/prizes', authenticateToken, validateWheelIdParam, validateCreateLuckyWheelPrize, createLuckyWheelPrize);
router.get('/:wheelId/prizes', validateWheelIdParam, validateQueryParams, getLuckyWheelPrizes);
router.put('/prizes/:id', authenticateToken, validateUpdateLuckyWheelPrize, updateLuckyWheelPrize);
router.delete('/prizes/:id', authenticateToken, validateIdParam, deleteLuckyWheelPrize);

// LuckyWheelSpin routes
router.post('/:wheelId/spin', authenticateToken, validateSpinLuckyWheel, spinLuckyWheel);
router.get('/:wheelId/info', validateWheelIdParam, getWheelInfo);
router.get('/user/history', authenticateToken, validateQueryParams, getUserSpinHistory);
router.get('/user/history/:wheelId', authenticateToken, validateWheelIdParam, validateQueryParams, getUserSpinHistory);
router.get('/user/stats', authenticateToken, getUserSpinStats);
router.get('/user/stats/:wheelId', authenticateToken, validateWheelIdParam, getUserSpinStats);

export default router;
