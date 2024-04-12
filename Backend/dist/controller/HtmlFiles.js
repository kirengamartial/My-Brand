import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const indexFile = (req, res) => {
    const indexPath = path.resolve(__dirname, '../../../Frontend/index.html');
    res.sendFile(indexPath);
};
export const registerFile = (req, res) => {
    const registerPath = path.resolve(__dirname, '../../../Frontend/register.html');
    res.sendFile(registerPath);
};
export const editProfileFile = (req, res) => {
    const registerPath = path.resolve(__dirname, '../../../Frontend/editProfile.html');
    res.sendFile(registerPath);
};
export const contactFile = (req, res) => {
    const contactPath = path.resolve(__dirname, '../../../Frontend/contact.html');
    res.sendFile(contactPath);
};
export const adminQueryFile = (req, res) => {
    const adminQueryPath = path.resolve(__dirname, '../../../Frontend/adminquery.html');
    res.sendFile(adminQueryPath);
};
export const loginFile = (req, res) => {
    const loginPath = path.resolve(__dirname, '../../../Frontend/login.html');
    res.sendFile(loginPath);
};
export const adminArticleFile = (req, res) => {
    const adminArticlePath = path.resolve(__dirname, '../../../Frontend/adminarticle.html');
    res.sendFile(adminArticlePath);
};
export const adminAddArticleFile = (req, res) => {
    const adminAddArticlePath = path.resolve(__dirname, '../../../Frontend/adminaddarticle.html');
    res.sendFile(adminAddArticlePath);
};
export const adminEditArticleFile = (req, res) => {
    const adminEditArticlePath = path.resolve(__dirname, '../../../Frontend/admineditarticle.html');
    res.sendFile(adminEditArticlePath);
};
export const blogFile = (req, res) => {
    const blogsPath = path.resolve(__dirname, '../../../Frontend/Blogs.html');
    res.sendFile(blogsPath);
};
export const contentBlogFile = (req, res) => {
    const contentBlogPath = path.resolve(__dirname, '../../../Frontend/ContentBlog1.html');
    res.sendFile(contentBlogPath);
};
export const aboutFile = (req, res) => {
    const aboutPath = path.resolve(__dirname, '../../../Frontend/about.html');
    res.sendFile(aboutPath);
};
export const portfolioFile = (req, res) => {
    const portfolioPath = path.resolve(__dirname, '../../../Frontend/portfolio.html');
    res.sendFile(portfolioPath);
};
//# sourceMappingURL=HtmlFiles.js.map