import express from 'express';
import { getKB, getKBById, createKB } from '../controllers/kbController.js';
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getKB)
    .post(protect, agentOrAdmin, createKB);

router.route('/:id')
    .get(getKBById);

export default router;
