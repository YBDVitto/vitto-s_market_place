import express from 'express';
import isAuth from '../middleware/is-auth.js';
import { withAuth } from './withAuth.js';
import { postChat, getChat } from '../controllers/chat.js';
const router = express.Router();
router.post('/post', isAuth, withAuth(postChat));
router.get('/get', isAuth, withAuth(getChat));
export default router;
