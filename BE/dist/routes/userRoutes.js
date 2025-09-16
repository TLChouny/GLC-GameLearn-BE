"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
// Protected routes
router.get('/', auth_1.authenticateToken, userController_1.getAllUsers);
router.get('/:id', auth_1.authenticateToken, userController_1.getUserById);
router.put('/:id', auth_1.authenticateToken, userController_1.updateUser);
router.delete('/:id', auth_1.authenticateToken, userController_1.deleteUser);
router.post('/add-friend', auth_1.authenticateToken, userController_1.addFriend);
router.put('/:id/points', auth_1.authenticateToken, userController_1.updateUserPoints);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map