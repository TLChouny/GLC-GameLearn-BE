"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWheelIdParam = exports.validateIdParam = exports.validateQueryParams = exports.validateSpinLuckyWheel = exports.validateUpdateLuckyWheelPrize = exports.validateCreateLuckyWheelPrize = exports.validateUpdateLuckyWheel = exports.validateCreateLuckyWheel = void 0;
const express_validator_1 = require("express-validator");
// Validation cho tạo LuckyWheel
exports.validateCreateLuckyWheel = [
    (0, express_validator_1.body)('wheelTitle')
        .notEmpty()
        .withMessage('Wheel title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Wheel title must be between 3 and 100 characters'),
    (0, express_validator_1.body)('wheelDescription')
        .notEmpty()
        .withMessage('Wheel description is required')
        .isLength({ max: 500 })
        .withMessage('Wheel description must not exceed 500 characters'),
    (0, express_validator_1.body)('maxSpinPerDay')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Max spin per day must be between 1 and 100'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho cập nhật LuckyWheel
exports.validateUpdateLuckyWheel = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid wheel ID'),
    (0, express_validator_1.body)('wheelTitle')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Wheel title must be between 3 and 100 characters'),
    (0, express_validator_1.body)('wheelDescription')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Wheel description must not exceed 500 characters'),
    (0, express_validator_1.body)('maxSpinPerDay')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Max spin per day must be between 1 and 100'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho tạo LuckyWheelPrize
exports.validateCreateLuckyWheelPrize = [
    (0, express_validator_1.param)('wheelId')
        .isMongoId()
        .withMessage('Invalid wheel ID'),
    (0, express_validator_1.body)('prizeName')
        .notEmpty()
        .withMessage('Prize name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Prize name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('prizeType')
        .isIn(['item', 'points', 'coins', 'special'])
        .withMessage('Prize type must be one of: item, points, coins, special'),
    (0, express_validator_1.body)('prizeValue')
        .isNumeric()
        .withMessage('Prize value must be a number')
        .isFloat({ min: 0 })
        .withMessage('Prize value must be non-negative'),
    (0, express_validator_1.body)('probability')
        .isNumeric()
        .withMessage('Probability must be a number')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Probability must be between 0 and 100'),
    (0, express_validator_1.body)('itemId')
        .optional()
        .isMongoId()
        .withMessage('Invalid item ID'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho cập nhật LuckyWheelPrize
exports.validateUpdateLuckyWheelPrize = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid prize ID'),
    (0, express_validator_1.body)('prizeName')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Prize name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('prizeType')
        .optional()
        .isIn(['item', 'points', 'coins', 'special'])
        .withMessage('Prize type must be one of: item, points, coins, special'),
    (0, express_validator_1.body)('prizeValue')
        .optional()
        .isNumeric()
        .withMessage('Prize value must be a number')
        .isFloat({ min: 0 })
        .withMessage('Prize value must be non-negative'),
    (0, express_validator_1.body)('probability')
        .optional()
        .isNumeric()
        .withMessage('Probability must be a number')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Probability must be between 0 and 100'),
    (0, express_validator_1.body)('itemId')
        .optional()
        .isMongoId()
        .withMessage('Invalid item ID'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho spin LuckyWheel
exports.validateSpinLuckyWheel = [
    (0, express_validator_1.param)('wheelId')
        .isMongoId()
        .withMessage('Invalid wheel ID'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho query parameters
exports.validateQueryParams = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho ID parameters
exports.validateIdParam = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
// Validation cho wheelId parameter
exports.validateWheelIdParam = [
    (0, express_validator_1.param)('wheelId')
        .isMongoId()
        .withMessage('Invalid wheel ID format'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
//# sourceMappingURL=luckyWheelValidation.js.map