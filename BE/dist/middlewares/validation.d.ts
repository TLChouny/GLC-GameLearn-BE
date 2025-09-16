import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const userRegistrationSchema: z.ZodObject<{
    userName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    gender: z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>;
    address: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        student: "student";
        admin: "admin";
        teacher: "teacher";
    }>>;
}, z.core.$strip>;
export declare const userLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const gameChallengeSchema: z.ZodObject<{
    title: z.ZodString;
    subjectId: z.ZodString;
    difficulty: z.ZodEnum<{
        easy: "easy";
        medium: "medium";
        hard: "hard";
    }>;
    rewardPoints: z.ZodNumber;
}, z.core.$strip>;
export declare const matchSchema: z.ZodObject<{
    players: z.ZodArray<z.ZodString>;
    gameChallengeId: z.ZodString;
}, z.core.$strip>;
export declare const itemSchema: z.ZodObject<{
    itemName: z.ZodString;
    itemType: z.ZodEnum<{
        weapon: "weapon";
        armor: "armor";
        consumable: "consumable";
        decoration: "decoration";
        special: "special";
    }>;
    itemPrice: z.ZodNumber;
    itemImage: z.ZodString;
}, z.core.$strip>;
export declare const rankingSchema: z.ZodObject<{
    userId: z.ZodString;
    totalPoints: z.ZodNumber;
    season: z.ZodString;
}, z.core.$strip>;
export declare const validateRequest: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map