import React, { useState, useRef, useEffect } from 'react';
import API from '../api';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am the Deskora Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ 
                senderName: m.role === 'user' ? 'User' : 'Deskora Bot', 
                content: m.content 
            }));
            const { data } = await API.post('/ai/platform-query', { message: input, history });
            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble responding right now. Feel free to create a ticket!" }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {!isOpen ? (
                <button 
                    onClick={toggleChat}
                    style={{ 
                        width: '65px', height: '65px', borderRadius: '22px', 
                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                        display: 'grid', placeItems: 'center', transition: 'var(--transition)',
                        background: 'linear-gradient(135deg, var(--primary-color), #818cf8)'
                    }}
                    className="pulse-animation"
                >
                    <Bot color="white" size={32} />
                </button>
            ) : (
                <div className="glass fade-in floating-bot" style={{ 
                    width: '380px', height: '550px', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5)', borderRadius: '28px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.15)'
                }}>
                    <div style={{ 
                        padding: '25px 20px', 
                        background: 'linear-gradient(to right, #4f46e5, #6366f1)', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                                <Bot size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>Deskora AI</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></div>
                                    Online • Always Helpful
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={toggleChat} 
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', padding: '8px', 
                                borderRadius: '10px', width: '36px', height: '36px',
                                display: 'grid', placeItems: 'center'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ 
                        flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', 
                        flexDirection: 'column', gap: '15px', background: 'rgba(0,0,0,0.02)' 
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ 
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%', padding: '12px 18px', borderRadius: '20px',
                                background: m.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                                color: m.role === 'user' ? 'white' : 'inherit',
                                fontSize: '0.92rem', lineHeight: 1.5,
                                borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                                borderBottomLeftRadius: m.role === 'bot' ? '4px' : '20px',
                                boxShadow: m.role === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary-color)' }} /> 
                                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Thinking...</span>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ 
                        padding: '20px', 
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid var(--glass-border)', 
                        display: 'flex', gap: '10px' 
                    }}>
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{ 
                                marginBottom: 0, padding: '12px 18px', 
                                borderRadius: '14px', border: '1px solid var(--glass-border)',
                                fontSize: '0.9rem', flex: 1
                            }}
                        />
                        <button type="submit" style={{ 
                            padding: '0', width: '48px', height: '48px', 
                            borderRadius: '14px', display: 'grid', placeItems: 'center',
                            flexShrink: 0
                        }}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatBot;
