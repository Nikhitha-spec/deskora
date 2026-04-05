import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, HelpCircle, Sparkles, Loader2, Bot } from 'lucide-react';

const KnowledgeBase = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [aiMode, setAiMode] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const fetchArticles = async () => {
        try {
            const { data } = await API.get(`/kb?search=${searchTerm}`);
            setArticles(data);
        } catch (error) {
            console.error('Error fetching KB', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!aiMode) {
            const delaySearch = setTimeout(() => {
                fetchArticles();
            }, 300);
            return () => clearTimeout(delaySearch);
        }
    }, [searchTerm, aiMode]);

    const handleAISearch = async () => {
        if (!searchTerm.trim()) return;
        setAiLoading(true);
        setAiResponse('');
        try {
            const { data } = await API.post('/ai/kb-query', { query: searchTerm });
            setAiResponse(data.response);
        } catch (error) {
            console.error('AI KB Error', error);
        } finally {
            setAiLoading(false);
        }
    };

    const categories = ['All', 'Getting Started', 'Technical', 'Billing', 'General'];
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredArticles = activeCategory === 'All' 
        ? articles 
        : articles.filter(a => a.category === activeCategory);

    const isLight = document.body.classList.contains('light');

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>How can we help?</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
                    <button 
                        onClick={() => setAiMode(false)}
                        style={{ 
                            background: !aiMode ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.05)', 
                            border: '1px solid var(--glass-border)', 
                            padding: '10px 24px', 
                            borderRadius: '30px', 
                            color: !aiMode ? 'white' : 'var(--primary-color)', 
                            fontSize: '0.9rem', 
                            cursor: 'pointer',
                            boxShadow: !aiMode ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                        }}
                    >
                        Browse Articles
                    </button>
                    <button 
                        onClick={() => setAiMode(true)}
                        style={{ 
                            background: aiMode ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.05)', 
                            border: '1px solid var(--glass-border)', 
                            padding: '10px 24px', 
                            borderRadius: '30px', 
                            color: aiMode ? 'white' : 'var(--primary-color)', 
                            fontSize: '0.9rem', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            boxShadow: aiMode ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                        }}
                    >
                        <Sparkles size={16} /> Ask AI Expert
                    </button>
                </div>
            </div>

            <div className="glass" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 20px', 
                marginBottom: '40px', 
                borderRadius: '24px',
                background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.03)',
                boxShadow: isLight ? '0 20px 40px rgba(99, 102, 241, 0.08)' : 'var(--shadow-lg)'
            }}>
                {aiMode ? <Sparkles size={24} style={{ color: 'var(--primary-color)' }} /> : <Search size={24} style={{ opacity: 0.5 }} />}
                <input 
                    type="text" 
                    placeholder={aiMode ? "Ask a question (e.g. How do I reset my password?)" : "Search for articles, guides, and more..."} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && aiMode && handleAISearch()}
                    style={{ background: 'transparent', border: 'none', padding: '24px', fontSize: '1.1rem', flex: 1, outline: 'none' }}
                />
                {aiMode && (
                    <button 
                        onClick={handleAISearch}
                        disabled={aiLoading}
                        style={{ padding: '10px 25px', borderRadius: '14px' }}
                    >
                        {aiLoading ? <Loader2 className="animate-spin" size={18} /> : "Ask"}
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{ 
                            background: activeCategory === cat ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.85rem',
                            color: activeCategory === cat ? 'white' : 'inherit',
                            transition: 'var(--transition)',
                            boxShadow: activeCategory === cat ? '0 8px 16px rgba(99, 102, 241, 0.2)' : 'none'
                        }}
                        className="card-hover"
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {aiMode ? (
                <div className="glass fade-in" style={{ 
                    padding: '40px', 
                    borderRadius: '28px', 
                    minHeight: '300px',
                    background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.05)'
                }}>
                    {aiLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                            <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-color)', marginBottom: '24px' }} />
                            <h3 style={{ fontSize: '1.3rem' }}>Consulting Deskora AI Expert...</h3>
                            <p style={{ opacity: 0.6, marginTop: '10px' }}>We're scanning 25+ support documents for the best answer.</p>
                        </div>
                    ) : aiResponse ? (
                        <div style={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', color: 'var(--primary-color)' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '14px' }}>
                                    <Bot size={28} />
                                </div>
                                <strong style={{ fontSize: '1.4rem' }}>Expert AI Answer</strong>
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', padding: '20px', borderRadius: '20px', background: isLight ? 'rgba(99, 102, 241, 0.03)' : 'rgba(255,255,255,0.02)' }}>{aiResponse}</div>
                            <div style={{ marginTop: '30px', padding: '24px', background: isLight ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.08)', borderRadius: '20px', fontSize: '0.95rem', borderLeft: '4px solid var(--primary-color)' }}>
                                💡 <strong>Tip:</strong> This answer was generated from our Knowledge Base. Not what you needed? You can always <a href="#" onClick={() => navigate('/tickets')} style={{ color: 'var(--primary-color)', fontWeight: 700 }}>create a ticket</a> to speak with a human.
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '60px' }}>
                            <HelpCircle size={64} style={{ marginBottom: '24px', opacity: 0.2 }} />
                            <h3>Ready to answer your questions!</h3>
                            <p>Ask anything about Deskora above to get an instant AI-powered response.</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                {selectedArticle ? (
                    <div className="glass fade-in" style={{ padding: '40px', borderRadius: '28px', position: 'relative', background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.05)' }}>
                        <button 
                            onClick={() => setSelectedArticle(null)}
                            style={{ position: 'absolute', top: '30px', right: '40px', background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, padding: '8px 16px', borderRadius: '12px' }}
                        >
                            Back to portal
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}>{selectedArticle.category}</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', lineHeight: 1.2 }}>{selectedArticle.title}</h2>
                        <div style={{ lineHeight: 1.9, fontSize: '1.15rem', opacity: 0.95, whiteSpace: 'pre-wrap' }}>
                            {selectedArticle.content}
                        </div>
                        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {selectedArticle.tags.map(tag => (
                                <span key={tag} style={{ background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '25px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '25px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px' }}>Loading the Help Center catalog...</p>
                        ) : filteredArticles.length > 0 ? (
                            filteredArticles.map(article => (
                                <div 
                                    key={article._id} 
                                    className="glass card-hover" 
                                    onClick={() => setSelectedArticle(article)}
                                    style={{ 
                                        padding: '30px', 
                                        borderRadius: '24px', 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '20px',
                                        background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.04)',
                                        border: isLight ? '1px solid #e2e8f0' : '1px solid var(--glass-border)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '14px', color: 'var(--primary-color)' }}>
                                            <BookOpen size={22} />
                                        </div>
                                        <ChevronRight size={18} style={{ opacity: 0.3 }} />
                                    </div>
                                    <div>
                                        <h3 style={{ marginBottom: '10px', fontSize: '1.25rem', lineHeight: 1.3 }}>{article.title}</h3>
                                        <p style={{ opacity: 0.65, fontSize: '0.94rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                                            {article.content}
                                        </p>
                                    </div>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <span style={{ opacity: 0.5, fontWeight: 500 }}>{article.viewCount} reads</span>
                                        <span style={{ 
                                            background: 'rgba(99, 102, 241, 0.1)', 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            color: 'var(--primary-color)', 
                                            fontWeight: 700,
                                            fontSize: '0.75rem'
                                        }}>{article.category}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass" style={{ gridColumn: '1/-1', padding: '70px', textAlign: 'center', borderRadius: '24px' }}>
                                <HelpCircle size={56} style={{ opacity: 0.15, marginBottom: '24px' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No articles match your search</h3>
                                <p style={{ opacity: 0.6 }}>Try clearing your filters or using different keywords.</p>
                            </div>
                        )}
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default KnowledgeBase;
