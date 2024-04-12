import Comment from '../model/Comment.js';
// comment 
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
export const postComment = async (req, res) => {
    try {
        const { blog_id, name, comment } = req.body;
        const comments = new Comment({ blog_id, name, comment });
        await comments.save();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json(error);
        console.log(error);
    }
};
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
export const getAllCommments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
//# sourceMappingURL=Comment.js.map