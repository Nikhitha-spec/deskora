import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { classifyTicketContext } from '../utils/ai.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
    const { title, priority } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const aiAnalysis = await classifyTicketContext(title);

        // Find best agent for this category
        const agents = await User.find({ role: 'Agent', assignedCategory: aiAnalysis.category });
        let assignedTo = null;
        if (agents.length > 0) {
            assignedTo = agents[Math.floor(Math.random() * agents.length)]._id;
        } else {
            const fallbackAgents = await User.find({ role: 'Agent' });
            if (fallbackAgents.length > 0) {
                assignedTo = fallbackAgents[Math.floor(Math.random() * fallbackAgents.length)]._id;
            }
        }

        const ticket = new Ticket({
            user: req.user._id,
            title,
            category: aiAnalysis.category,
            priority: priority || aiAnalysis.priority, // Use user priority if provided
            sentiment: aiAnalysis.sentiment,
            assignedTo
        });

        const createdTicket = await ticket.save();
        res.status(201).json(createdTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating ticket' });
    }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate('user', 'name email')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching tickets' });
    }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name');

        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching ticket' });
    }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/AgentAdmin
export const updateTicketStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            ticket.status = status || ticket.status;
            const updatedTicket = await ticket.save();
            res.json(updatedTicket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating ticket status' });
    }
};
