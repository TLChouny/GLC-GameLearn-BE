import { Request, Response } from 'express';
export declare const createLuckyWheel: (req: Request, res: Response) => Promise<void>;
export declare const getAllLuckyWheels: (req: Request, res: Response) => Promise<void>;
export declare const getLuckyWheelById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLuckyWheel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLuckyWheel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLuckyWheelPrize: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLuckyWheelPrizes: (req: Request, res: Response) => Promise<void>;
export declare const updateLuckyWheelPrize: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLuckyWheelPrize: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=luckyWheelController.d.ts.map