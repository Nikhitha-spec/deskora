import Ticket from '../models/Ticket.js';

// @desc    Get Admin/Agent Dashboard Analytics
// @route   GET /api/dashboard
// @access  Private/AgentAdmin
export const getDashboardStats = async (req, res) => {
    try {
        let matchStage = {};
        
        // If agent, only show their stats. Admin sees all.
        if (req.user.role === 'Agent') {
            matchStage = { assignedTo: req.user._id };
        }

        const totalTickets = await Ticket.countDocuments(matchStage);
        const resolvedTickets = await Ticket.countDocuments({ ...matchStage, status: 'resolved' });
        const openTickets = await Ticket.countDocuments({ ...matchStage, status: 'open' });
        const inProgressTickets = await Ticket.countDocuments({ ...matchStage, status: 'in-progress' });

        const resolutionRate = totalTickets === 0 ? 0 : Math.round((resolvedTickets / totalTickets) * 100);
        const activeWorkload = openTickets + inProgressTickets;

        res.json({
            totalTickets,
            resolvedTickets,
            resolutionRate,
            activeWorkload,
            openTickets,
            inProgressTickets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
