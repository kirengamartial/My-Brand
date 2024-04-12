import { Request, Response } from "express";
/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Retrieve all blogs
 *     description: Retrieve all blogs from the database.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request. Error occurred while retrieving blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the blog.
 *         title:
 *           type: string
 *           description: Title of the blog.
 *         description:
 *           type: string
 *           description: Description or content of the blog.
 *         photo:
 *           type: string
 *           description: URL of the blog photo.
 *       required:
 *         - title
 *         - description
 *         - photo
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *       description: JWT token to authenticate the user.
 */
export declare const getAllBlog: (req: Request, res: Response) => Promise<void>;
/**
* @swagger
* /api/blog/{id}:
*   get:
*     summary: Retrieve a blog by ID
*     description: Retrieve a single blog entry from the database by its ID.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID of the blog to retrieve.
*     security:
*       - cookieAuth: []
*     responses:
*       '200':
*         description: Blog retrieved successfully.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Blog'
*       '400':
*         description: Bad request. Error occurred while retrieving the blog.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   description: Error message.
*
*     components:
*       schemas:
*         Blog:
*           type: object
*           properties:
*             _id:
*               type: string
*               description: Unique identifier for the blog.
*             title:
*               type: string
*               description: Title of the blog.
*             description:
*               type: string
*               description: Description or content of the blog.
*             photo:
*               type: string
*               description: URL of the blog photo.
*           required:
*             - title
*             - description
*             - photo
*       cookieAuth:
*         type: apiKey
*         in: cookie
*         name: jwt
*         description: JWT token to authenticate the user.
*/
export declare const getSingleBlog: (req: Request, res: Response) => Promise<void>;
export declare const createBlog: (req: Request, res: Response) => Promise<void>;
export declare const editBlog: (req: Request, res: Response) => Promise<void>;
/**
* @swagger
* /blog/{id}:
*   delete:
*     summary: Delete a blog by ID
*     description: Delete an existing blog entry from the database by its ID.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID of the blog to delete.
*     security:
*       - cookieAuth: []
*     responses:
*       '204':
*         description: Blog deleted successfully.
*       '404':
*         description: Blog not found.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message indicating blog not found.
*       '500':
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message indicating server error.
*
*     components:
*       securitySchemes:
*         cookieAuth:
*           type: apiKey
*           in: cookie
*           name: jwt
*           description: JWT token to authenticate the user.
*/
export declare const deleteBlog: (req: Request, res: Response) => Promise<void>;
