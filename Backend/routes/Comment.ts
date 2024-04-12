import {Router} from 'express'
import {postComment} from '../controller/Comment.js'
const router = Router()


router.post('/comment', postComment)
router.get('/comment', )
  

export default router