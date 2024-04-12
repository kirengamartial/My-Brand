import Joi from 'joi';
import Message from '../model/Message.js';
// Message
/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send a contact message
 *     description: Send a contact message with the provided name, email, question, and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - question
 *               - description
 *     responses:
 *       '200':
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '400':
 *         description: Failed to send the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const messageSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'any.required': 'Email is required'
    }),
    question: Joi.string().required().messages({
        'any.required': 'Username is required'
    }),
    description: Joi.string().required().messages({
        'any.required': 'Username is required'
    }),
});
export const validateUserMessage = (req, res, next) => {
    const { error } = messageSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(err => err.message);
        if (errors) {
            return res.status(400).json({ error: 'fill all fields please' });
        }
    }
    next();
};
export const createContact = async (req, res) => {
    try {
        const { name, email, question, description } = req.body;
        const message = new Message({ name, email, question, description });
        await message.save();
        res.status(200).json({ message: 'message sent successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'An error occurred while sending a message' });
    }
};
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
export const getAllMessage = async (req, res) => {
    try {
        const message = await Message.find();
        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
//# sourceMappingURL=Message.js.map