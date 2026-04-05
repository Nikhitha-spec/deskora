import Message from '../models/Message.js';
import Ticket from '../models/Ticket.js';
import { generateAgentReply } from '../utils/ai.js';

// @desc    Add a message
// @route   POST /api/messages/:ticketId
// @access  Private
export const addMessage = async (req, res) => {
    const { content, isAI, attachmentUrl, attachmentType } = req.body;
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const message = new Message({
            ticket: ticketId,
            sender: req.user._id,
            content: content || (attachmentUrl ? "Sent an attachment" : ""),
            attachmentUrl,
            attachmentType,
            isAI: isAI || false
        });

        const createdMessage = await message.save();
        
        await createdMessage.populate('sender', 'name role');

        res.status(201).json(createdMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding message' });
    }
};

// @desc    Upload file message
// @route   POST /api/messages/:ticketId/upload
// @access  Private
export const uploadMessage = async (req, res) => {
    const { ticketId } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const message = new Message({
            ticket: ticketId,
            sender: req.user._id,
            content: "Sent an attachment",
            attachmentUrl: req.file.path,
            attachmentType: req.file.mimetype.startsWith('image') ? 'image' : 'file'
        });

        const createdMessage = await message.save();
        await createdMessage.populate('sender', 'name role');

        res.status(201).json(createdMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error uploading file' });
    }
};

// @desc    Get messages for a ticket
// @route   GET /api/messages/:ticketId
// @access  Private
export const getMessages = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const messages = await Message.find({ ticket: ticketId })
            .populate('sender', 'name role')
            .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

// @desc    Generate AI suggestion for agent
// @route   GET /api/messages/:ticketId/suggest
// @access  Private/AgentAdmin
export const suggestReply = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const messages = await Message.find({ ticket: ticketId })
            .populate('sender', 'name role')
            .sort({ createdAt: 1 });
        
        const contextMessages = messages.map(msg => ({
            senderName: msg.sender.name,
            senderRole: msg.sender.role,
            content: msg.content
        }));

        const suggestion = await generateAgentReply(contextMessages);
        
        res.json({ suggestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating reply' });
    }
};
