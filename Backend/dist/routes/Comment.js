import { Router } from 'express';
import { postComment, getAllCommments } from '../controller/Comment.js';
const router = Router();
router.post('/comment', postComment);
router.get('/comment', getAllCommments);
export default router;
//# sourceMappingURL=Comment.js.map