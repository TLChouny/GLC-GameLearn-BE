import { Request, Response } from 'express';
export declare const createItem: (req: Request, res: Response) => Promise<void>;
export declare const getAllItems: (req: Request, res: Response) => Promise<void>;
export declare const getItemById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createHouseDecoration: (req: Request, res: Response) => Promise<void>;
export declare const getAllHouseDecorations: (req: Request, res: Response) => Promise<void>;
export declare const createTrade: (req: Request, res: Response) => Promise<void>;
export declare const getTradeHistory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=itemController.d.ts.map