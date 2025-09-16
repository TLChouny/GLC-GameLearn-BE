"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.rankingSchema = exports.itemSchema = exports.matchSchema = exports.gameChallengeSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
// Validation schemas
exports.userRegistrationSchema = zod_1.z.object({
    userName: zod_1.z.string().min(3).max(30),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    gender: zod_1.z.enum(['male', 'female', 'other']),
    address: zod_1.z.string().min(1),
    role: zod_1.z.enum(['student', 'admin', 'teacher']).optional()
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.gameChallengeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    subjectId: zod_1.z.string().min(1),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']),
    rewardPoints: zod_1.z.number().min(0)
});
exports.matchSchema = zod_1.z.object({
    players: zod_1.z.array(zod_1.z.string()).min(2),
    gameChallengeId: zod_1.z.string().min(1)
});
exports.itemSchema = zod_1.z.object({
    itemName: zod_1.z.string().min(1).max(100),
    itemType: zod_1.z.enum(['weapon', 'armor', 'consumable', 'decoration', 'special']),
    itemPrice: zod_1.z.number().min(0),
    itemImage: zod_1.z.string().min(1)
});
exports.rankingSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    totalPoints: zod_1.z.number().min(0),
    season: zod_1.z.string().min(1)
});
// Validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map