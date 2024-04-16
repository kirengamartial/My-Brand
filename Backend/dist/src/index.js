import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from "path";
import cookieParser from 'cookie-parser';
import { checkUser } from '../middleware/authMiddleware.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { fileURLToPath } from 'url';
dotenv.config();
// import htmlRouter from '../routes/HtmlFiles.js'
import userRouter from '../routes/Users.js';
import messageRouter from '../routes/Message.js';
import blogRouter from '../routes/Blog.js';
import commentRouter from '../routes/Comment.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://kirengamartial.github.io',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
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
    apis: ["./dist/controller/*.js"]
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
// app.use('/', htmlRouter)
app.use('/', userRouter);
app.use('/', messageRouter);
app.use('/', blogRouter);
app.use('/', commentRouter);
export default app;
//# sourceMappingURL=index.js.map