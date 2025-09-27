"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const itemController_1 = require("../controllers/itemController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Ensure upload directory exists (projectRoot/uploads/items)
const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'items');
fs_1.default.mkdirSync(uploadDir, { recursive: true });
// Multer storage config
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const base = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${base}-${unique}${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage });
// Item routes
router.post('/items', auth_1.authenticateToken, itemController_1.createItem);
router.get('/items', itemController_1.getAllItems);
router.get('/items/:id', itemController_1.getItemById);
router.put('/items/:id', auth_1.authenticateToken, itemController_1.updateItem);
router.delete('/items/:id', auth_1.authenticateToken, itemController_1.deleteItem);
// Upload item image
router.post('/items/upload', auth_1.authenticateToken, upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'Không có file được upload' });
    }
    const relativePath = `/uploads/items/${file.filename}`;
    return res.json({ success: true, message: 'Upload thành công', data: { url: relativePath } });
});
// House Decoration routes
router.post('/house-decorations', auth_1.authenticateToken, itemController_1.createHouseDecoration);
router.get('/house-decorations', itemController_1.getAllHouseDecorations);
// Trade routes
router.post('/trades', auth_1.authenticateToken, itemController_1.createTrade);
router.get('/trades/match/:matchId', auth_1.authenticateToken, itemController_1.getTradeHistory);
exports.default = router;
//# sourceMappingURL=itemRoutes.js.map