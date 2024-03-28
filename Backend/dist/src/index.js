"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const Users_1 = __importDefault(require("../model/Users"));
const Message_1 = __importDefault(require("../model/Message"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
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
const spacs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spacs));
// Serve static files
const staticPath = path_1.default.join(__dirname, '../../../Frontend/assets');
app.use('/assets', express_1.default.static(staticPath));
mongoose_1.default.connect(process.env.MONGODB_URL)
    .then(res => console.log('connected successfully to the database'))
    .catch(error => console.log('Error connecting to database', error));
app.get('*', authMiddleware_1.checkUser);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../Frontend', 'index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../Frontend', 'register.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../Frontend', 'contact.html'));
});
app.get('/query', authMiddleware_1.checkAuth, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../Frontend', 'adminquery.html'));
});
app.get('/logins', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../Frontend', 'login.html'));
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
const userSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        'any.required': 'Username is required'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    confirmPassword: joi_1.default.string().required().equal(joi_1.default.ref("password")).messages({
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
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
};
app.post('/users', validateUserInput, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = new Users_1.default({ username, email, password });
        yield user.save();
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
}));
app.get('/api/user', (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ error: 'User data not found' });
    }
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield Users_1.default.findOne({ email });
        if (!email || !password) {
            res.status(400).json({ message: 'fill all the fields please' });
        }
        else if (user) {
            const auth = yield bcrypt_1.default.compare(password, user.password);
            if (auth) {
                const token = cookieToken(user._id);
                res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true });
                res.status(200).json({ user: user._id });
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
}));
app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ success: true });
});
// Message
const messageSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        'any.required': 'Username is required'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'any.required': 'Email is required'
    }),
    question: joi_1.default.string().required().messages({
        'any.required': 'Username is required'
    }),
    description: joi_1.default.string().required().messages({
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
app.post('/contact', validateUserMessage, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, question, description } = req.body;
        const message = new Message_1.default({ name, email, question, description });
        yield message.save();
        res.status(200).json({ message: 'message sent successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'An error occurred while sending a message' });
    }
}));
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
app.get('/contact/message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Message_1.default.find();
        res.status(200).json(message);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
exports.default = app;
