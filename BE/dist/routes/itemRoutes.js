"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemController_1 = require("../controllers/itemController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Item routes
router.post('/items', auth_1.authenticateToken, itemController_1.createItem);
router.get('/items', itemController_1.getAllItems);
router.get('/items/:id', itemController_1.getItemById);
router.put('/items/:id', auth_1.authenticateToken, itemController_1.updateItem);
router.delete('/items/:id', auth_1.authenticateToken, itemController_1.deleteItem);
// House Decoration routes
router.post('/house-decorations', auth_1.authenticateToken, itemController_1.createHouseDecoration);
router.get('/house-decorations', itemController_1.getAllHouseDecorations);
// Trade routes
router.post('/trades', auth_1.authenticateToken, itemController_1.createTrade);
router.get('/trades/match/:matchId', auth_1.authenticateToken, itemController_1.getTradeHistory);
exports.default = router;
//# sourceMappingURL=itemRoutes.js.map