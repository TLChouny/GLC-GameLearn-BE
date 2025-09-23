import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Validation cho tạo LuckyWheel
export const validateCreateLuckyWheel = [
  body('wheelTitle')
    .notEmpty()
    .withMessage('Wheel title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Wheel title must be between 3 and 100 characters'),
  
  body('wheelDescription')
    .notEmpty()
    .withMessage('Wheel description is required')
    .isLength({ max: 500 })
    .withMessage('Wheel description must not exceed 500 characters'),
  
  body('maxSpinPerDay')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max spin per day must be between 1 and 100'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateUpdateLuckyWheel = [
  param('id')
    .isMongoId()
    .withMessage('Invalid wheel ID'),
  
  body('wheelTitle')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Wheel title must be between 3 and 100 characters'),
  
  body('wheelDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Wheel description must not exceed 500 characters'),
  
  body('maxSpinPerDay')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max spin per day must be between 1 and 100'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateCreateLuckyWheelPrize = [
  param('wheelId')
    .isMongoId()
    .withMessage('Invalid wheel ID'),
  
  body('prizeName')
    .notEmpty()
    .withMessage('Prize name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Prize name must be between 1 and 100 characters'),
  
  body('prizeType')
    .isIn(['item', 'points', 'coins', 'special'])
    .withMessage('Prize type must be one of: item, points, coins, special'),
  
  body('prizeValue')
    .isNumeric()
    .withMessage('Prize value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Prize value must be non-negative'),
  
  body('probability')
    .isNumeric()
    .withMessage('Probability must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Probability must be between 0 and 100'),
  
  body('itemId')
    .optional()
    .isMongoId()
    .withMessage('Invalid item ID'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateUpdateLuckyWheelPrize = [
  param('id')
    .isMongoId()
    .withMessage('Invalid prize ID'),
  
  body('prizeName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Prize name must be between 1 and 100 characters'),
  
  body('prizeType')
    .optional()
    .isIn(['item', 'points', 'coins', 'special'])
    .withMessage('Prize type must be one of: item, points, coins, special'),
  
  body('prizeValue')
    .optional()
    .isNumeric()
    .withMessage('Prize value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Prize value must be non-negative'),
  
  body('probability')
    .optional()
    .isNumeric()
    .withMessage('Probability must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Probability must be between 0 and 100'),
  
  body('itemId')
    .optional()
    .isMongoId()
    .withMessage('Invalid item ID'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateSpinLuckyWheel = [
  param('wheelId')
    .isMongoId()
    .withMessage('Invalid wheel ID'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateWheelIdParam = [
  param('wheelId')
    .isMongoId()
    .withMessage('Invalid wheel ID format'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
