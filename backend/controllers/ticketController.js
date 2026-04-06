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
        const { category, priority: aiPriority, sentiment } = aiAnalysis;

        // Intelligent Routing Logic: Find agent in category with least active workload
        let assignedTo = null;
        const potentialAgents = await User.find({ 
            role: 'Agent', 
            assignedCategory: category 
        });

        const targetAgents = potentialAgents.length > 0 
            ? potentialAgents 
            : await User.find({ role: 'Agent' });

        if (targetAgents.length > 0) {
            // Find agent with lowest active ticket count
            const agentWorkloads = await Promise.all(targetAgents.map(async (agent) => {
                const count = await Ticket.countDocuments({ 
                    assignedTo: agent._id, 
                    status: { $in: ['open', 'in-progress'] } 
                });
                return { agentId: agent._id, count };
            }));

            // Sort by count and pick the lowest
            agentWorkloads.sort((a, b) => a.count - b.count);
            assignedTo = agentWorkloads[0].agentId;
        }

        const ticket = new Ticket({
            user: req.user._id,
            title,
            category,
            priority: priority || aiPriority,
            sentiment,
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
