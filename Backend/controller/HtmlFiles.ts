import path from 'path'
import { fileURLToPath } from 'url';
import {Request, Response} from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const indexFile = (req: Request, res: Response) => {
    const indexPath = path.resolve(__dirname, '../../../Frontend/index.html');
    res.sendFile(indexPath);
}
export const registerFile = (req: Request, res: Response) => {
    const registerPath = path.resolve(__dirname, '../../../Frontend/register.html');
    res.sendFile(registerPath);
}
export const editProfileFile = (req: Request, res: Response) => {
    const registerPath = path.resolve(__dirname, '../../../Frontend/editProfile.html');
    res.sendFile(registerPath);
}

export const contactFile = (req: Request, res: Response) => {
    const contactPath = path.resolve(__dirname, '../../../Frontend/contact.html');
    res.sendFile(contactPath);
}
export const adminQueryFile = (req: Request, res: Response) => {
    const adminQueryPath = path.resolve(__dirname, '../../../Frontend/adminquery.html');
    res.sendFile(adminQueryPath);
}

export const loginFile = (req: Request, res: Response) => {
    const loginPath = path.resolve(__dirname, '../../../Frontend/login.html');
    res.sendFile(loginPath);
}

export const adminArticleFile = (req: Request, res: Response) => {
    const adminArticlePath = path.resolve(__dirname, '../../../Frontend/adminarticle.html');
    res.sendFile(adminArticlePath);
}

export const adminAddArticleFile = (req: Request, res: Response) => {
    const adminAddArticlePath = path.resolve(__dirname, '../../../Frontend/adminaddarticle.html');
    res.sendFile(adminAddArticlePath);
}

export const adminEditArticleFile =  (req: Request, res: Response) => {
    const adminEditArticlePath = path.resolve(__dirname, '../../../Frontend/admineditarticle.html');
    res.sendFile(adminEditArticlePath);
}

export const blogFile =  (req: Request, res: Response) => {
    const blogsPath = path.resolve(__dirname, '../../../Frontend/Blogs.html');
    res.sendFile(blogsPath);
}

export const contentBlogFile = (req: Request, res: Response) => {
    const contentBlogPath = path.resolve(__dirname, '../../../Frontend/ContentBlog1.html');
    res.sendFile(contentBlogPath);
}

export const aboutFile = (req: Request, res: Response) => {
    const aboutPath = path.resolve(__dirname, '../../../Frontend/about.html');
    res.sendFile(aboutPath);
}

export const portfolioFile =  (req: Request, res: Response) => {
    const portfolioPath = path.resolve(__dirname, '../../../Frontend/portfolio.html');
    res.sendFile(portfolioPath);
}


