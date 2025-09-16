import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
export const userRegistrationSchema = z.object({
  userName: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1),
  role: z.enum(['student', 'admin', 'teacher']).optional()
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const gameChallengeSchema = z.object({
  title: z.string().min(1).max(100),
  subjectId: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  rewardPoints: z.number().min(0)
});

export const matchSchema = z.object({
  players: z.array(z.string()).min(2),
  gameChallengeId: z.string().min(1)
});

export const itemSchema = z.object({
  itemName: z.string().min(1).max(100),
  itemType: z.enum(['weapon', 'armor', 'consumable', 'decoration', 'special']),
  itemPrice: z.number().min(0),
  itemImage: z.string().min(1)
});

export const rankingSchema = z.object({
  userId: z.string().min(1),
  totalPoints: z.number().min(0),
  season: z.string().min(1)
});

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: (error as z.ZodError<unknown>).issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};