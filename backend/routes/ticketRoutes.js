import express from 'express';
import { createTicket, getTickets, getTicketById, updateTicketStatus } from '../controllers/ticketController.js';
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTicket)
    .get(protect, getTickets);

router.route('/:id')
    .get(protect, getTicketById);

router.route('/:id/status')
    .put(protect, agentOrAdmin, updateTicketStatus);

export default router;
