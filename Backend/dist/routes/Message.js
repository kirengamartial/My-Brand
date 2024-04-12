import { Router } from 'express';
import { validateUserMessage, createContact, getAllMessage } from '../controller/Message.js';
const router = Router();
router.post('/contact', validateUserMessage, createContact);
router.get('/contact/message', getAllMessage);
export default router;
//# sourceMappingURL=Message.js.map