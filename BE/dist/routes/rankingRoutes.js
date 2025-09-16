"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rankingController_1 = require("../controllers/rankingController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Ranking routes
router.post('/update', auth_1.authenticateToken, rankingController_1.updateRanking);
router.get('/season/:season', rankingController_1.getRankingsBySeason);
router.get('/top/:season', rankingController_1.getTopRankings);
router.get('/user/:userId/season/:season', rankingController_1.getUserRanking);
router.get('/seasons', rankingController_1.getAllSeasons);
router.post('/update-all', auth_1.authenticateToken, rankingController_1.updateAllRankings);
exports.default = router;
//# sourceMappingURL=rankingRoutes.js.map