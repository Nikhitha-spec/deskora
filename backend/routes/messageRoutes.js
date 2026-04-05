import express from 'express';
import { addMessage, getMessages, suggestReply, uploadMessage } from '../controllers/messageController.js';
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/:ticketId')
    .post(protect, addMessage)
    .get(protect, getMessages);

router.route('/:ticketId/upload')
    .post(protect, upload.single('file'), uploadMessage);

router.route('/:ticketId/suggest')
    .get(protect, agentOrAdmin, suggestReply);

export default router;
