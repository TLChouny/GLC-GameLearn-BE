import { Request, Response } from 'express';
export declare const updateRanking: (req: Request, res: Response) => Promise<void>;
export declare const getRankingsBySeason: (req: Request, res: Response) => Promise<void>;
export declare const getTopRankings: (req: Request, res: Response) => Promise<void>;
export declare const getUserRanking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllSeasons: (req: Request, res: Response) => Promise<void>;
export declare const updateAllRankings: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=rankingController.d.ts.map