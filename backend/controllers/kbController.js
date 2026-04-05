import KnowledgeBase from '../models/KnowledgeBase.js';

// @desc    Get all KB articles
// @route   GET /api/kb
// @access  Public
export const getKB = async (req, res) => {
    try {
        const query = req.query.search 
            ? { $or: [{ title: { $regex: req.query.search, $options: 'i' } }, { content: { $regex: req.query.search, $options: 'i' } }] }
            : {};
        
        const articles = await KnowledgeBase.find(query).sort({ viewCount: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching KB" });
    }
};

// @desc    Get single KB article
// @route   GET /api/kb/:id
// @access  Public
export const getKBById = async (req, res) => {
    try {
        const article = await KnowledgeBase.findById(req.params.id);
        if (article) {
            article.viewCount += 1;
            await article.save();
            res.json(article);
        } else {
            res.status(404).json({ message: "Article not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error fetching article" });
    }
};

// @desc    Create KB article (Admin only)
// @route   POST /api/kb
// @access  Private/Admin
export const createKB = async (req, res) => {
    try {
        const article = new KnowledgeBase(req.body);
        const created = await article.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: "Server error creating KB" });
    }
};
