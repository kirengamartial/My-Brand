import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import { indexFile, registerFile, editProfileFile, contactFile, adminQueryFile, loginFile, adminArticleFile, adminAddArticleFile, adminEditArticleFile, blogFile, contentBlogFile, aboutFile, portfolioFile } from '../controller/HtmlFiles.js';
const router = Router();
router.get('/', indexFile);
router.get('/register', registerFile);
router.get('/profile/:id', editProfileFile);
router.get('/contact', contactFile);
router.get('/query', checkAuth, adminQueryFile);
router.get('/logins', loginFile);
router.get('/article', checkAuth, adminArticleFile);
router.get('/add_article', checkAuth, adminAddArticleFile);
router.get('/blogs/:id', checkAuth, adminEditArticleFile);
router.get('/blogs', blogFile);
router.get('/blogss/:id', contentBlogFile);
router.get('/about', aboutFile);
router.get('/portfolio', portfolioFile);
export default router;
//# sourceMappingURL=HtmlFiles.js.map