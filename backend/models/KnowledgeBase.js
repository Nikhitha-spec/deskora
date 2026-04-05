import mongoose from 'mongoose';

const kwowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Billing', 'Technical', 'General', 'Getting Started'],
        default: 'General'
    },
    tags: [String],
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const KnowledgeBase = mongoose.model('KnowledgeBase', kwowledgeBaseSchema);
export default KnowledgeBase;
