import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from "path";
import cookieParser from 'cookie-parser'
import {checkUser, checkAuth} from '../middleware/authMiddleware'
import User from '../model/Users'
import Message from '../model/Message'
import jwt from 'jsonwebtoken'
import Joi from 'joi';
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import bcrypt from 'bcrypt'
import Blog from '../model/Blog'

dotenv.config()


const app = express()
app.use(express.json())
app.use(cookieParser())

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
const spacs = swaggerJSDoc(options)
app.use('/api-docs', 
 swaggerUi.serve,
 swaggerUi.setup(spacs)
)

// Serve static files
const staticPath = path.join(__dirname, '../../../Frontend/assets');
app.use('/assets', express.static(staticPath));

mongoose.connect(process.env.MONGODB_URL!)
.then(res => console.log('connected successfully to the database'))
.catch(error => console.log('Error connecting to database', error))



app.get('*', checkUser)
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'index.html'));
});

app.get('/register', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'register.html'));
});

app.get('/contact', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'contact.html'));
});

app.get('/query', checkAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'adminquery.html'));
});

app.get('/logins', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'login.html'));
});

app.get('/article',checkAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'adminarticle.html'));
});

app.get('/add_article',checkAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'adminaddarticle.html'));
});

app.get('/blogs/:id',checkAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../Frontend', 'admineditarticle.html'));
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

const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  const errorToCheck = { username: '', email: '', password: '', confirmPassword: ''}
  if (error) {
     error.details.forEach((err: any) => {
      const path = err.path as keyof typeof errorToCheck
      errorToCheck[path] = err.message
    })
    console.log(errorToCheck)
    return res.status(400).json({error: errorToCheck});
  }
  next();
};

const handleDuplicateEmailError = (error: any) => {
  if (error.code === 11000) {
    return 'Email is already associated with an account';
  }
  return null;
};

const cookieToken = (id: any) =>{
return jwt.sign({id}, process.env.JWT_SECRET!, {
    expiresIn: 3 * 24 * 60 * 60
})
}
app.post('/users', validateUserInput, async(req: Request, res: Response) => {
    try {
        const {username, email, password} = req.body
        const user = new User({username, email, password})
        await user.save()
        const token =  cookieToken(user._id)
        res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true,  path: '/'})
        res.status(200).json({ user: user._id})

    } catch (error) {
     
      const duplicateEmailErrorMessage = handleDuplicateEmailError(error);
      if (duplicateEmailErrorMessage) {
        const errors = {
          email: duplicateEmailErrorMessage
        }
        return res.status(400).json({ error: errors});
      }
      res.status(400).json({ error: 'An error occurred while creating the user' });
        
    }
})

app.get('/api/user', (req: Request, res: Response) => {
  const user = res.locals.user;
  if (user) {
      res.status(200).json(user);
  } else {
      res.status(404).json({ error: 'User data not found' });
  }
});

app.post('/login',async(req: Request, res: Response) =>{
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if(!email || !password) {
      res.status(400).json({message: 'fill all the fields please'})
    }else if(user) {
      const auth = await bcrypt.compare(password, user.password)
      if(auth) {
         const token = cookieToken(user._id)
         res.cookie('jwt', token, {maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true})
         res.status(200).json({user: user._id})
      }else { 
        res.status(400).json({message: 'password is incorrect'})
      }
     
    }else {
      res.status(400).json({message: 'email is incorrect'})
    }
   
  } catch (error) {
    console.log(error)
  }
 
})

app.post('/logout', (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 1})
  res.status(200).json({ success: true });
})

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

const validateUserMessage = (req: Request, res: Response, next: NextFunction) => {
  const { error } = messageSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(err => err.message);
    if(errors){
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
app.post('/contact', validateUserMessage, async(req, res) => {
  try {
      const { name, email, question, description } = req.body
      const message = new Message({name, email, question, description})
      await message.save()
      res.status(200).json({message: 'message sent successfully'})
  } catch (error) {
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
app.get('/contact/message', async(req, res) => {
  try {
      const message = await Message.find()
      res.status(200).json(message)
  } catch (error) {
      res.status(400).json(error)
  }
});




// blogs
app.get('/blog', async(req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
    res.status(200).json(blogs)
  } catch (error) {
    res.status(400).json({error})
  }
})

app.get('/api/blog/:id', async(req: Request, res: Response) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
    res.status(200).json(blog)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/blog', async(req: Request, res: Response) => {
  try {
    const { photo, title, description} = req.body
    const blog = await new Blog({ photo, title, description})
    await blog.save()
    res.status(200).json({message: 'created a blog successfully'})
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }


})

app.put('/blog/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {photo, title, description } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.photo = photo || blog.photo
    blog.title = title || blog.title;
    blog.description = description ?? blog.description;
    
    await blog.save();
    res.status(200).json(blog)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/blog/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      res.status(404).json({ message: 'blog not found' });
    } else {
      res.status(204).send();
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default app

