import { Request, Response, NextFunction } from "express";
export declare const validateUserInput: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const gellAllusers: (req: Request, res: Response) => Promise<void>;
export declare const getUser: (req: Request, res: Response) => void;
export declare const editUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user credentials and generate JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       '200':
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: User ID.
 *       '400':
 *         description: Bad request. Either email or password is incorrect or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Clear JWT cookie to log out the user.
 *     responses:
 *       '200':
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the logout was successful.
 */
