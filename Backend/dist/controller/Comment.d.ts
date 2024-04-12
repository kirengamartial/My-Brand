import { Request, Response } from "express";
/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment on a blog post
 *     description: Adds a new comment to a specific blog post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_id:
 *                 type: string
 *                 description: The ID of the blog post to comment on.
 *               name:
 *                 type: string
 *                 description: The name of the commenter.
 *               comment:
 *                 type: string
 *                 description: The comment content.
 *     responses:
 *       '200':
 *         description: Successfully created a new comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the newly created comment.
 *                 blog_id:
 *                   type: string
 *                   description: The ID of the blog post the comment belongs to.
 *                 name:
 *                   type: string
 *                   description: The name of the commenter.
 *                 comment:
 *                   type: string
 *                   description: The content of the comment.
 *       '400':
 *         description: Bad request. Could not create the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the reason for failure.
 */
export declare const postComment: (req: Request, res: Response) => Promise<void>;
/**
* @swagger
* /comment:
*   get:
*     summary: Get all comments
*     description: Retrieves all comments for blog posts.
*     responses:
*       '200':
*         description: Successfully retrieved all comments.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   _id:
*                     type: string
*                     description: The ID of the comment.
*                   blog_id:
*                     type: string
*                     description: The ID of the blog post the comment belongs to.
*                   name:
*                     type: string
*                     description: The name of the commenter.
*                   comment:
*                     type: string
*                     description: The content of the comment.
*       '400':
*         description: Bad request. Could not retrieve comments.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message describing the reason for failure.
*/
export declare const getAllCommments: (req: Request, res: Response) => Promise<void>;
