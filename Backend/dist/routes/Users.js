import { Router } from 'express';
import { validateUserInput, createUser, editUser, loginUser, logoutUser, gellAllusers } from '../controller/Users.js';
const router = Router();
router.post('/users', validateUserInput, createUser);
router.get('/allusers', gellAllusers);
// router.get('/api/user', getUser);
router.put('/api/user/:id', editUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
export default router;
//# sourceMappingURL=Users.js.map