import { Request, Response } from 'express';
export declare const spinLuckyWheel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserSpinHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserSpinStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWheelInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=luckyWheelSpinController.d.ts.map