import {Router} from 'express'
import {getAllBlog, getSingleBlog, createBlog, editBlog, deleteBlog} from '../controller/Blog.js'

const router = Router()


router.get('/blog', getAllBlog)
router.get('/api/blog/:id', getSingleBlog)
router.post('/blog', createBlog);  
router.put('/blog/:id', editBlog);
router.delete('/blog/:id',deleteBlog);

export default router