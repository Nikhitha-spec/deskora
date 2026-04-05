import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, agentOrAdmin, getDashboardStats);

export default router;
