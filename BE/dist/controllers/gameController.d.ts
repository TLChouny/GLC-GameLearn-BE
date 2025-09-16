import { Request, Response } from 'express';
export declare const createGameChallenge: (req: Request, res: Response) => Promise<void>;
export declare const getAllGameChallenges: (req: Request, res: Response) => Promise<void>;
export declare const createMatch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMatchStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMatchById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserMatches: (req: Request, res: Response) => Promise<void>;
export declare const createCertificate: (req: Request, res: Response) => Promise<void>;
export declare const getUserCertificates: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=gameController.d.ts.map