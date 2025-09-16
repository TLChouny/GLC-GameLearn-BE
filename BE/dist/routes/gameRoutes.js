"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Game Challenge routes
router.post('/challenges', auth_1.authenticateToken, gameController_1.createGameChallenge);
router.get('/challenges', gameController_1.getAllGameChallenges);
// Match routes
router.post('/matches', auth_1.authenticateToken, gameController_1.createMatch);
router.put('/matches/:id/status', auth_1.authenticateToken, gameController_1.updateMatchStatus);
router.get('/matches/:id', auth_1.authenticateToken, gameController_1.getMatchById);
router.get('/users/:userId/matches', auth_1.authenticateToken, gameController_1.getUserMatches);
// Certificate routes
router.post('/certificates', auth_1.authenticateToken, gameController_1.createCertificate);
router.get('/users/:userId/certificates', auth_1.authenticateToken, gameController_1.getUserCertificates);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map