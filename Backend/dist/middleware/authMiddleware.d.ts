import { Request, Response, NextFunction } from 'express';
export declare const checkAuth: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const checkUser: (req: Request, res: Response, next: NextFunction) => void;
