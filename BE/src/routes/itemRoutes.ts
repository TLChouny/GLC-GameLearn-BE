import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  createHouseDecoration,
  getAllHouseDecorations,
  createTrade,
  getTradeHistory
} from '../controllers/itemController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Item routes
router.post('/items', authenticateToken, createItem);
router.get('/items', getAllItems);
router.get('/items/:id', getItemById);
router.put('/items/:id', authenticateToken, updateItem);
router.delete('/items/:id', authenticateToken, deleteItem);

// House Decoration routes
router.post('/house-decorations', authenticateToken, createHouseDecoration);
router.get('/house-decorations', getAllHouseDecorations);

// Trade routes
router.post('/trades', authenticateToken, createTrade);
router.get('/trades/match/:matchId', authenticateToken, getTradeHistory);

export default router;
