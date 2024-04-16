import User from '../model/Users.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
export const validateUserInput = (req, res, next) => {
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
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashpassword = await bcrypt.hash(password, salt);
        const user = new User({ username, email, password: hashpassword });
        await user.save();
        const token = cookieToken(user._id);
        // res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000,  path: '/My-Brand/Frontend/'});
        res.status(200).json({ user: user._id, token });
    }
    catch (error) {
        const duplicateEmailErrorMessage = handleDuplicateEmailError(error);
        if (duplicateEmailErrorMessage) {
            const errors = {
                email: duplicateEmailErrorMessage
            };
            return res.status(400).json({ error: errors });
        }
        res.status(400).json({ error });
    }
};
export const gellAllusers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
    }
};
export const getUser = (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ error: 'User data not found' });
    }
};
export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json('There is no user');
        }
        else {
            user.username = username || user.username;
            user.email = email || user.email;
            if (password !== null && password !== undefined && password.trim() !== '') {
                const salt = await bcrypt.genSalt();
                const hashpassword = await bcrypt.hash(password, salt);
                user.password = hashpassword;
                console.log(user.password, { "changed password": password });
            }
            else {
                user.password = user.password;
            }
            await user.save();
            return res.status(200).json({ msg: 'Edited successfully' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
//   login user
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
export const loginUser = async (req, res) => {
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
                //  res.cookie('jwt', token, {maxAge: 3 * 24 * 60 * 60 * 1000, path: '/' })
                res.status(200).json({ user: user._id, token: token });
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
};
//   logout user 
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
// export const logoutUser =  (req: Request, res: Response) => {
//   console.log('this Token',req.headers.authorization?.split(' ')[1])
//   console.log(req.cookies.jwt)
//   res.cookie('jwt', '', { maxAge: 1})
//   res.status(200).json({ success: true });
// }
//# sourceMappingURL=Users.js.map