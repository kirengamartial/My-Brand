import { Router } from 'express';
import { validateUserInput, createUser, getUser, editUser, loginUser, logoutUser } from '../controller/Users.js';
const router = Router();
router.post('/users', validateUserInput, createUser);
router.get('/api/user', getUser);
router.put('/api/user/:id', editUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
export default router;
//# sourceMappingURL=Users.js.map