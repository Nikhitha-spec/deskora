import Ticket from '../models/Ticket.js';

// @desc    Get Admin/Agent Dashboard Analytics
// @route   GET /api/dashboard
// @access  Private/AgentAdmin
export const getDashboardStats = async (req, res) => {
    try {
        let matchStage = {};
        
        // If agent, only show their stats. User shows their own tickets. Admin sees all.
        if (req.user.role === 'Agent') {
            matchStage = { assignedTo: req.user._id };
        } else if (req.user.role === 'User') {
            matchStage = { user: req.user._id };
        }

        const totalTickets = await Ticket.countDocuments(matchStage);
        const resolvedTickets = await Ticket.countDocuments({ ...matchStage, status: 'resolved' });
        const openTickets = await Ticket.countDocuments({ ...matchStage, status: 'open' });
        const inProgressTickets = await Ticket.countDocuments({ ...matchStage, status: 'in-progress' });

        const resolutionRate = totalTickets === 0 ? 0 : Math.round((resolvedTickets / totalTickets) * 100);
        const activeWorkload = openTickets + inProgressTickets;

        // Category Distribution
        const categoryDist = await Ticket.aggregate([
            { $match: matchStage },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Priority Distribution
        const priorityDist = await Ticket.aggregate([
            { $match: matchStage },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        // Sentiment Distribution
        const sentimentDist = await Ticket.aggregate([
            { $match: matchStage },
            { $group: { _id: "$sentiment", count: { $sum: 1 } } }
        ]);

        // Daily Trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyTrends = await Ticket.aggregate([
            { $match: { ...matchStage, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Recent activity: last 5 tickets
        const recentTickets = await Ticket.find(matchStage)
            .populate('assignedTo', 'name assignedCategory')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalTickets,
            resolvedTickets,
            resolutionRate,
            activeWorkload,
            openTickets,
            inProgressTickets,
            categoryDistribution: categoryDist,
            priorityDistribution: priorityDist,
            sentimentDistribution: sentimentDist,
            dailyTrends: dailyTrends,
            recentTickets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
