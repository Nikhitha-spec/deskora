import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachmentUrl: {
        type: String,
        default: null
    },
    attachmentType: {
        type: String, // 'image', 'pdf', etc.
        default: null
    },
    isAI: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
