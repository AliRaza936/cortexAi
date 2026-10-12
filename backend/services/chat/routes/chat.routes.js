import express from 'express';
import { createConversations, getConversations, getMessages, saveMessage, updateConversations } from '../controllers/chat.controllers.js';

const router = express.Router();

router.get('/create-conversation', createConversations)
router.get('/get-conversations', getConversations)
router.post('/update-conversation', updateConversations)
router.post('/save-message', saveMessage)
router.get('/get-messages/:conversationId', getMessages )

export default router;