import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from "path";
import cookieParser from 'cookie-parser';
import { checkUser, checkAuth } from '../middleware/authMiddleware.js';
import User from '../model/Users.js';
import Message from '../model/Message.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import bcrypt from 'bcrypt';
import Blog from '../model/Blog.js';
import Comment from '../model/Comment.js';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "portfolio api doc",
            version: "0.1",
            description: "portfolio documented with swagger",
            contact: {
                name: "Martial kirenga",
                url: 'me.com',
                email: "info@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3000/"
            }
        ],
        components: {
            schemas: {
                Message: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        email: {
                            type: "string"
                        },
                        question: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        }
                    },
                    required: ["name", "email", "question", "description"]
                },
                Users: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string"
                        },
                        email: {
                            type: "string"
                        },
                        password: {
                            type: "string"
                        },
                        isAdmin: {
                            type: "boolean"
                        }
                    },
                    required: ["username", "email", "password"]
                }
            }
        }
    },
    apis: ["./dist/src/*.js"]
};
const spacs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spacs));
// Serve static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticPath = path.resolve(__dirname, '../../../Frontend/assets');
app.use('/assets', express.static(staticPath));
mongoose.connect(process.env.MONGODB_URL)
    .then(res => console.log('connected successfully to the database'))
    .catch(error => console.log('Error connecting to database', error));
app.get('*', checkUser);
app.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, '../../../Frontend/index.html');
    res.sendFile(indexPath);
});
app.get('/register', (req, res) => {
    const registerPath = path.resolve(__dirname, '../../../Frontend/register.html');
    res.sendFile(registerPath);
});
app.get('/contact', (req, res) => {
    const contactPath = path.resolve(__dirname, '../../../Frontend/contact.html');
    res.sendFile(contactPath);
});
app.get('/query', checkAuth, (req, res) => {
    const adminQueryPath = path.resolve(__dirname, '../../../Frontend/adminquery.html');
    res.sendFile(adminQueryPath);
});
app.get('/logins', (req, res) => {
    const loginPath = path.resolve(__dirname, '../../../Frontend/login.html');
    res.sendFile(loginPath);
});
app.get('/article', checkAuth, (req, res) => {
    const adminArticlePath = path.resolve(__dirname, '../../../Frontend/adminarticle.html');
    res.sendFile(adminArticlePath);
});
app.get('/add_article', checkAuth, (req, res) => {
    const adminAddArticlePath = path.resolve(__dirname, '../../../Frontend/adminaddarticle.html');
    res.sendFile(adminAddArticlePath);
});
app.get('/blogs/:id', checkAuth, (req, res) => {
    const adminEditArticlePath = path.resolve(__dirname, '../../../Frontend/admineditarticle.html');
    res.sendFile(adminEditArticlePath);
});
app.get('/blogs', (req, res) => {
    const blogsPath = path.resolve(__dirname, '../../../Frontend/Blogs.html');
    res.sendFile(blogsPath);
});
app.get('/blogss/:id', (req, res) => {
    const contentBlogPath = path.resolve(__dirname, '../../../Frontend/ContentBlog1.html');
    res.sendFile(contentBlogPath);
});
app.get('/about', (req, res) => {
    const aboutPath = path.resolve(__dirname, '../../../Frontend/about.html');
    res.sendFile(aboutPath);
});
app.get('/portfolio', (req, res) => {
    const portfolioPath = path.resolve(__dirname, '../../../Frontend/portfolio.html');
    res.sendFile(portfolioPath);
});
//users
/**
 * @swagger
 * tags:
 *   name: portfolio enpoints
 *   description: portfolio management enpoints
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successfully registered the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: The ID of the registered user.
 *       '400':
 *         description: Failed to register the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const userSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        'any.only': 'Confirm password must match the password',
        'any.required': 'Confirm password is required'
    })
});
const validateUserInput = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    const errorToCheck = { username: '', email: '', password: '', confirmPassword: '' };
    if (error) {
        error.details.forEach((err) => {
            const path = err.path;
            errorToCheck[path] = err.message;
        });
        console.log(errorToCheck);
        return res.status(400).json({ error: errorToCheck });
    }
    next();
};
const handleDuplicateEmailError = (error) => {
    if (error.code === 11000) {
        return 'Email is already associated with an account';
    }
    return null;
};
const cookieToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
};
app.post('/users', validateUserInput, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        const token = cookieToken(user._id);
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/' });
        res.status(200).json({ user: user._id });
    }
    catch (error) {
        const duplicateEmailErrorMessage = handleDuplicateEmailError(error);
        if (duplicateEmailErrorMessage) {
            const errors = {
                email: duplicateEmailErrorMessage
            };
            return res.status(400).json({ error: errors });
        }
        res.status(400).json({ error: 'An error occurred while creating the user' });
    }
});
app.get('/api/user', (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ error: 'User data not found' });
    }
});
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
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!email || !password) {
            res.status(400).json({ message: 'fill all the fields please' });
        }
        else if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = cookieToken(user._id);
                res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true });
                res.status(200).json({ token: token, user: user });
            }
            else {
                res.status(400).json({ message: 'password is incorrect' });
            }
        }
        else {
            res.status(400).json({ message: 'email is incorrect' });
        }
    }
    catch (error) {
        console.log(error);
    }
});
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
app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ success: true });
});
// Message
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
const validateUserMessage = (req, res, next) => {
    const { error } = messageSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(err => err.message);
        if (errors) {
            return res.status(400).json({ error: 'fill all fields please' });
        }
    }
    next();
};
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
app.post('/contact', validateUserMessage, async (req, res) => {
    try {
        const { name, email, question, description } = req.body;
        const message = new Message({ name, email, question, description });
        await message.save();
        res.status(200).json({ message: 'message sent successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'An error occurred while sending a message' });
    }
});
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
app.get('/contact/message', async (req, res) => {
    try {
        const message = await Message.find();
        res.status(200).json(message);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
// blogs
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
app.get('/blog', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
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
app.get('/api/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog entry with provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 description: URL of the blog photo.
 *               title:
 *                 type: string
 *                 description: Title of the blog.
 *               description:
 *                 type: string
 *                 description: Description or content of the blog.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Blog created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 id:
 *                   type: string
 *                   description: ID of the created blog.
 *       '400':
 *         description: Bad request. Error occurred while creating the blog.
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
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *       description: JWT token to authenticate the user.
 */
app.post('/blog', async (req, res) => {
    try {
        const { photo, title, description } = req.body;
        const blog = await new Blog({ photo, title, description });
        await blog.save();
        res.status(200).json({ message: 'created a blog successfully', id: blog._id });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});
/**
 * @swagger
 * /blog/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     description: Update an existing blog entry in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 description: Updated URL of the blog photo.
 *               title:
 *                 type: string
 *                 description: Updated title of the blog.
 *               description:
 *                 type: string
 *                 description: Updated description or content of the blog.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Blog updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
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
app.put('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { photo, title, description } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.photo = photo || blog.photo;
        blog.title = title || blog.title;
        blog.description = description ?? blog.description;
        await blog.save();
        res.status(200).json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
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
app.delete('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            res.status(404).json({ message: 'blog not found' });
        }
        else {
            res.status(204).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
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
app.post('/comment', async (req, res) => {
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
});
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
app.get('/comment', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
// app.listen(3000, () => console.log('app is listening to port 3000'));
export default app;
//# sourceMappingURL=index.js.map