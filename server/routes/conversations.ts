import express from 'express';
import {
  getConversation,
  postConversation,
} from '../controllers/conversations';

const router = express.Router();

router.post('/post-conversation', postConversation);

router.get('/get-conversation', getConversation);

export default router;
