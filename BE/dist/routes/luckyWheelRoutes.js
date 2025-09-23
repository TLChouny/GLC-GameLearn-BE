"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const luckyWheelController_1 = require("../controllers/luckyWheelController");
const luckyWheelSpinController_1 = require("../controllers/luckyWheelSpinController");
const auth_1 = require("../middlewares/auth");
const luckyWheelValidation_1 = require("../middlewares/luckyWheelValidation");
const router = express_1.default.Router();
// LuckyWheel CRUD routes
router.post('/', auth_1.authenticateToken, luckyWheelValidation_1.validateCreateLuckyWheel, luckyWheelController_1.createLuckyWheel);
router.get('/', luckyWheelValidation_1.validateQueryParams, luckyWheelController_1.getAllLuckyWheels);
router.get('/:id', luckyWheelValidation_1.validateIdParam, luckyWheelController_1.getLuckyWheelById);
router.put('/:id', auth_1.authenticateToken, luckyWheelValidation_1.validateUpdateLuckyWheel, luckyWheelController_1.updateLuckyWheel);
router.delete('/:id', auth_1.authenticateToken, luckyWheelValidation_1.validateIdParam, luckyWheelController_1.deleteLuckyWheel);
// LuckyWheelPrize routes
router.post('/:wheelId/prizes', auth_1.authenticateToken, luckyWheelValidation_1.validateWheelIdParam, luckyWheelValidation_1.validateCreateLuckyWheelPrize, luckyWheelController_1.createLuckyWheelPrize);
router.get('/:wheelId/prizes', luckyWheelValidation_1.validateWheelIdParam, luckyWheelValidation_1.validateQueryParams, luckyWheelController_1.getLuckyWheelPrizes);
router.put('/prizes/:id', auth_1.authenticateToken, luckyWheelValidation_1.validateUpdateLuckyWheelPrize, luckyWheelController_1.updateLuckyWheelPrize);
router.delete('/prizes/:id', auth_1.authenticateToken, luckyWheelValidation_1.validateIdParam, luckyWheelController_1.deleteLuckyWheelPrize);
// LuckyWheelSpin routes
router.post('/:wheelId/spin', auth_1.authenticateToken, luckyWheelValidation_1.validateSpinLuckyWheel, luckyWheelSpinController_1.spinLuckyWheel);
router.get('/:wheelId/info', luckyWheelValidation_1.validateWheelIdParam, luckyWheelSpinController_1.getWheelInfo);
router.get('/user/history', auth_1.authenticateToken, luckyWheelValidation_1.validateQueryParams, luckyWheelSpinController_1.getUserSpinHistory);
router.get('/user/history/:wheelId', auth_1.authenticateToken, luckyWheelValidation_1.validateWheelIdParam, luckyWheelValidation_1.validateQueryParams, luckyWheelSpinController_1.getUserSpinHistory);
router.get('/user/stats', auth_1.authenticateToken, luckyWheelSpinController_1.getUserSpinStats);
router.get('/user/stats/:wheelId', auth_1.authenticateToken, luckyWheelValidation_1.validateWheelIdParam, luckyWheelSpinController_1.getUserSpinStats);
exports.default = router;
//# sourceMappingURL=luckyWheelRoutes.js.map