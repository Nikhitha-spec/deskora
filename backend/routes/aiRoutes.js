import express from 'express';
import { generateBotResponse, translateText, queryKB } from '../utils/ai.js';
import { protect } from '../middleware/authMiddleware.js';
import KnowledgeBase from '../models/KnowledgeBase.js';

const router = express.Router();

// KB AI Search
router.post('/kb-query', protect, async (req, res) => {
    const { query } = req.body;
    try {
        const kbArticles = await KnowledgeBase.find({});
        const response = await queryKB(query, kbArticles);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: "KB Search error" });
    }
});

// Translate text
router.post('/translate', protect, async (req, res) => {
    const { text, targetLanguage } = req.body;
    try {
        const translatedText = await translateText(text, targetLanguage);
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ message: "Translation error" });
    }
});

// General Platform query (not tied to ticket)
router.post('/platform-query', protect, async (req, res) => {
    const { message, history } = req.body;
    try {
        const botResponse = await generateBotResponse(message, history || []);
        res.json({ response: botResponse });
    } catch (error) {
        res.status(500).json({ message: "Bot error" });
    }
});

export default router;
