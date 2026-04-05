import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const TicketList = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchTickets = async () => {
        try {
            const { data } = await API.get('/tickets');
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();

        socket.on('new_ticket_alert', (ticket) => {
            fetchTickets(); // Refresh the list
        });

        return () => {
            socket.off('new_ticket_alert');
        };
    }, []);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicketTitle) return;
        setIsCreating(true);
        try {
            const { data } = await API.post('/tickets', { title: newTicketTitle, priority });
            setNewTicketTitle('');
            setPriority('medium');
            socket.emit('create_ticket', data);
            fetchTickets();
        } catch (error) {
            console.error('Error creating ticket', error);
        } finally {
            setIsCreating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <Clock size={16} color="#fbbf24" />;
            case 'in-progress': return <HelpCircle size={16} color="#60a5fa" />;
            case 'resolved': return <CheckCircle size={16} color="#34d399" />;
            default: return null;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#f87171';
            case 'medium': return '#fbbf24';
            case 'low': return '#60a5fa';
            default: return 'inherit';
        }
    };

    return (
        <div className="fade-in">
            <div className="ticket-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>My Tickets</h1>
                {user.role === 'User' && (
                    <form onSubmit={handleCreateTicket} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Describe your issue..." 
                            value={newTicketTitle} 
                            onChange={(e) => setNewTicketTitle(e.target.value)}
                            style={{ width: '300px', marginBottom: 0 }}
                            required
                        />
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            style={{ width: '120px', marginBottom: 0 }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button type="submit" disabled={isCreating} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Plus size={18} /> {isCreating ? 'Creating...' : 'New Ticket'}
                        </button>
                    </form>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading tickets...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    {tickets.length === 0 ? (
                        <div className="glass" style={{ padding: '40px', textAlign: 'center', opacity: 0.7 }}>
                            No tickets found.
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <Link to={`/tickets/${ticket._id}`} key={ticket._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="glass card-hover" style={{ 
                                    padding: '24px', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                            <span style={{ 
                                                fontSize: '0.65rem', 
                                                fontWeight: 900, 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                background: 'rgba(255,255,255,0.05)',
                                                border: `1px solid rgba(255,255,255,0.1)`,
                                                color: getPriorityColor(ticket.priority),
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                {ticket.priority}
                                            </span>
                                            <div style={{ 
                                                width: '8px', 
                                                height: '8px', 
                                                borderRadius: '50%', 
                                                background: ticket.sentiment === 'positive' ? '#10b981' : ticket.sentiment === 'negative' ? '#ef4444' : '#6b7280',
                                                boxShadow: `0 0 10px ${ticket.sentiment === 'positive' ? '#10b981' : ticket.sentiment === 'negative' ? '#ef4444' : '#6b7280'}`
                                            }} title={`Sentiment: ${ticket.sentiment}`}></div>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 500 }}>{ticket.category}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 600 }}>{ticket.title}</h3>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-color)', display: 'grid', placeItems: 'center', fontSize: '0.6rem', color: 'white' }}>
                                                    {ticket.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                {ticket.user?.name || 'Customer'}
                                            </div>
                                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '12px' }}></div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={14} /> {formatDistanceToNow(new Date(ticket.createdAt))} ago
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            padding: '8px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.03)',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}>
                                            {getStatusIcon(ticket.status)} {ticket.status}
                                        </div>
                                        {ticket.assignedTo && (
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic' }}>
                                                Agent: <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{ticket.assignedTo.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketList;
