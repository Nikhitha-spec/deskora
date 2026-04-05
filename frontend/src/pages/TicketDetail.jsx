import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, Bot, Terminal, Clock, CheckCircle2, MoreHorizontal, User as UserIcon, Paperclip, Loader2, Languages } from 'lucide-react';
import { format } from 'date-fns';

const socket = io('http://localhost:5000');

const TicketDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [translatingId, setTranslatingId] = useState(null);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data } = await API.get(`/tickets/${id}`);
                setTicket(data);
            } catch (error) {
                console.error('Error fetching ticket', error);
                navigate('/tickets');
            }
        };

        const fetchMessages = async () => {
            try {
                const { data } = await API.get(`/messages/${id}`);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchTicket();
        fetchMessages();

        socket.emit('join_ticket', id);

        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [id, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e, content = newMessage, isAI = false) => {
        if (e) e.preventDefault();
        if (!content.trim()) return;

        try {
            const { data } = await API.post(`/messages/${id}`, { content, isAI });
            // Emit to socket
            socket.emit('send_message', data);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await API.post(`/messages/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            socket.emit('send_message', data);
        } catch (error) {
            console.error('Error uploading file', error);
            alert("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleTranslateMessage = async (msgId, text, lang) => {
        setTranslatingId(msgId);
        try {
            const { data } = await API.post('/ai/translate', { text, targetLanguage: lang });
            setMessages(prev => prev.map(m => m._id === msgId ? { ...m, content: data.translatedText, originalContent: text } : m));
        } catch (error) {
            console.error('Translation error', error);
        } finally {
            setTranslatingId(null);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await API.put(`/tickets/${id}/status`, { status });
            setTicket(prev => ({ ...prev, status }));
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleGetAiSuggestion = async () => {
        setAiLoading(true);
        try {
            const { data } = await API.get(`/messages/${id}/suggest`);
            setNewMessage(data.suggestion);
        } catch (error) {
            console.error('Error getting AI suggestion', error);
        } finally {
            setAiLoading(false);
        }
    };

    if (!ticket) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading conversation...</div>;

    return (
        <div className="fade-in two-column-layout" style={{ height: 'calc(100vh - 150px)', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: '20px' }}>
            <div className="glass chat-container" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ marginBottom: '5px' }}>{ticket.title}</h2>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>User: {ticket.user.name} • Status: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{ticket.status}</span></div>
                    </div>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignSelf: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                                maxWidth: '75%',
                                gap: '4px'
                            }}
                        >
                            <div style={{ 
                                fontSize: '0.7rem', 
                                opacity: 0.6, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                alignSelf: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                                margin: '0 10px',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {msg.sender.role === 'Agent' ? <Bot size={13} style={{ color: 'var(--primary-color)' }} /> : (msg.isAI ? <Terminal size={13} /> : <UserIcon size={13} />)}
                                    <span style={{ fontWeight: 600 }}>{msg.sender.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => handleTranslateMessage(msg._id, msg.originalContent || msg.content, 'English')}
                                        style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary-color)', fontSize: '0.65rem', cursor: 'pointer', opacity: translatingId === msg._id ? 0.5 : 1 }}
                                        title="Translate to English"
                                    >
                                        <Languages size={12} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ 
                                padding: '12px 18px', 
                                borderRadius: '20px',
                                borderBottomRightRadius: msg.sender._id === user._id ? '4px' : '20px',
                                borderBottomLeftRadius: msg.sender._id !== user._id ? '4px' : '20px',
                                background: msg.sender._id === user._id ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                                color: msg.sender._id === user._id ? 'white' : 'inherit',
                                boxShadow: msg.sender._id === user._id ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                                fontSize: '0.92rem',
                                lineHeight: 1.5,
                                border: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative'
                            }}>
                                {translatingId === msg._id ? "Translating..." : msg.content}
                                {msg.originalContent && (
                                    <div 
                                        onClick={() => setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, content: m.originalContent, originalContent: null } : m))}
                                        style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Show original
                                    </div>
                                )}
                                {msg.attachmentUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        {msg.attachmentType === 'image' ? (
                                            <img src={msg.attachmentUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                        ) : (
                                            <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'underline' }}>
                                                <Paperclip size={14} /> View Document
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div style={{ 
                                fontSize: '0.65rem', 
                                opacity: 0.4, 
                                alignSelf: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                                margin: '0 10px'
                            }}>
                                {format(new Date(msg.createdAt), 'p')}
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }}
                            accept="image/*,application/pdf"
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current.click()} 
                            disabled={uploading}
                            style={{ 
                                background: 'rgba(99, 102, 241, 0.08)', 
                                border: '1px solid rgba(99, 102, 241, 0.2)', 
                                display: 'grid', 
                                placeItems: 'center', 
                                width: '48px', 
                                height: '48px',
                                borderRadius: '14px',
                                padding: 0,
                                color: 'var(--primary-color)',
                                transition: 'var(--transition)'
                            }}
                            className="card-hover"
                            title="Attach File"
                        >
                            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                        </button>
                        
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ marginBottom: 0, flex: 1 }}
                        />
                        {(user.role === 'Admin' || user.role === 'Agent') && (
                            <button 
                                type="button" 
                                onClick={handleGetAiSuggestion} 
                                disabled={aiLoading}
                                style={{ 
                                    background: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid var(--glass-border)', 
                                    display: 'grid', 
                                    placeItems: 'center', 
                                    width: '48px', 
                                    height: '48px',
                                    borderRadius: '14px',
                                    padding: 0,
                                    transition: 'var(--transition)'
                                }}
                                className="card-hover"
                                title="AI Co-pilot Suggestion"
                            >
                                <Bot size={20} color={aiLoading ? "#666" : "var(--primary-color)"} />
                            </button>
                        )}
                        <button 
                            type="submit" 
                            style={{ 
                                display: 'grid', 
                                placeItems: 'center', 
                                width: '48px', 
                                height: '48px',
                                borderRadius: '14px',
                                padding: 0,
                                margin: 0,
                                transition: 'var(--transition)'
                            }}
                            className="card-hover"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="glass" style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Ticket Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Priority</div>
                        <div style={{ textTransform: 'uppercase', fontWeight: 600, color: ticket.priority === 'high' ? '#ef4444' : '#fbbf24' }}>{ticket.priority}</div>
                    </div>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Category</div>
                        <div style={{ textTransform: 'capitalize' }}>{ticket.category}</div>
                    </div>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Sentiment</div>
                        <div style={{ textTransform: 'capitalize' }}>{ticket.sentiment}</div>
                    </div>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Created</div>
                        <div>{format(new Date(ticket.createdAt), 'MMM dd, p')}</div>
                    </div>
                    
                    {(user.role === 'Admin' || user.role === 'Agent') && (
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
                            <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '10px' }}>Admin Actions</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {ticket.status !== 'in-progress' && (
                                    <button onClick={() => handleUpdateStatus('in-progress')} style={{ width: '100%', background: '#60a5fa', fontSize: '0.8rem' }}>
                                        Mark In-Progress
                                    </button>
                                )}
                                {ticket.status !== 'resolved' && (
                                    <button onClick={() => handleUpdateStatus('resolved')} style={{ width: '100%', background: '#34d399', fontSize: '0.8rem' }}>
                                        Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
