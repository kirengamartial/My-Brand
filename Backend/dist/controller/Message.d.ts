import { Request, Response, NextFunction } from "express";
export declare const validateUserMessage: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const createContact: (req: Request, res: Response) => Promise<void>;
/**
* @swagger
* /contact/message:
*   get:
*     summary: Get all contact messages
*     description: Retrieve all contact messages.
*     responses:
*       '200':
*         description: Successfully retrieved contact messages.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Message'
*       '400':
*         description: Failed to retrieve contact messages.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Error message.
*/
export declare const getAllMessage: (req: Request, res: Response) => Promise<void>;
