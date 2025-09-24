import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response } from 'express';
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

// Ensure upload directory exists (projectRoot/uploads/items)
const uploadDir = path.join(process.cwd(), 'uploads', 'items');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

// Item routes
router.post('/items', authenticateToken, createItem);
router.get('/items', getAllItems);
router.get('/items/:id', getItemById);
router.put('/items/:id', authenticateToken, updateItem);
router.delete('/items/:id', authenticateToken, deleteItem);

// Upload item image
router.post('/items/upload', authenticateToken, upload.single('file'), (req: Request, res: Response) => {
  const file = (req as unknown as { file?: Express.Multer.File }).file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'Không có file được upload' });
  }
  const relativePath = `/uploads/items/${file.filename}`;
  return res.json({ success: true, message: 'Upload thành công', data: { url: relativePath } });
});

// House Decoration routes
router.post('/house-decorations', authenticateToken, createHouseDecoration);
router.get('/house-decorations', getAllHouseDecorations);

// Trade routes
router.post('/trades', authenticateToken, createTrade);
router.get('/trades/match/:matchId', authenticateToken, getTradeHistory);

export default router;
