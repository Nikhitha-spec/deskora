import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Activity, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = async () => {
        setIsRefreshing(true);
        try {
            const { data } = await API.get('/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
            <div className="animate-spin" style={{ color: 'var(--primary-color)' }}><RefreshCw size={40} /></div>
            <p style={{ opacity: 0.6, letterSpacing: '1px' }}>SYNCHRONIZING ANALYTICS...</p>
        </div>
    );

    if (!stats) return null;

    // Status Chart Data
    const statusData = [
        { name: 'Open', value: stats.openTickets || 0, color: '#fbbf24' },
        { name: 'In Progress', value: stats.inProgressTickets || 0, color: '#6366f1' },
        { name: 'Resolved', value: stats.resolvedTickets || 0, color: '#34d399' },
    ];

    // Priority Chart Data
    const priorityData = stats.priorityDistribution?.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count,
        color: item._id === 'high' ? '#ef4444' : item._id === 'medium' ? '#f59e0b' : '#10b981'
    })) || [{ name: 'N/A', value: 0, color: '#4b5563' }];

    // Category Chart Data
    const categoryData = stats.categoryDistribution?.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count
    })) || [{ name: 'None', value: 0 }];

    // Trend Data
    const trendData = stats.dailyTrends?.map(item => ({
        date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tickets: item.count
    })) || [{ date: 'Today', tickets: 0 }];

    // Sentiment Data
    const sentimentData = stats.sentimentDistribution?.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count,
        color: item._id === 'positive' ? '#10b981' : item._id === 'neutral' ? '#6366f1' : '#ef4444'
    })) || [{ name: 'Waiting', value: 0, color: '#4b5563' }];

    const { user, mode } = useAuth();
    const isUser = user?.role === 'User';
    const chartTextColor = mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(30, 41, 59, 0.7)';
    const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '14px', color: mode === 'dark' ? 'white' : 'var(--text-light)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    <p style={{ margin: 0, fontWeight: 700, marginBottom: '4px' }}>{label || payload[0].name}</p>
                    <p style={{ margin: 0, color: payload[0].fill || 'var(--primary-color)', fontSize: '0.9rem' }}>{`${payload[0].value} Tickets`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <Activity size={32} color="var(--primary-color)" /> {isUser ? 'Personal Support Hub' : 'Dashboard Insights'}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                        <div className="pulse-animation" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></div>
                        <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>SYSTEM {isUser ? 'ONLINE' : 'LIVE MONITORING'}</span>
                    </div>
                    <button 
                        onClick={fetchStats} 
                        className="glass" 
                        style={{ padding: '8px 12px', borderRadius: '10px', background: 'transparent' }}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>
            
            {/* Stat Cards */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass card-hover stat-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{isUser ? 'My Total Tickets' : 'Total Volume'}</div>
                        <BarChart3 size={20} color="#6366f1" />
                    </div>
                    <div className="dashboard-card-value" style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.totalTickets}</div>
                </div>
                <div className="glass card-hover stat-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{isUser ? 'Resolved Requests' : 'Resolution Rate'}</div>
                        <TrendingUp size={20} color="#34d399" />
                    </div>
                    <div className="dashboard-card-value" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399' }}>{isUser ? stats.resolvedTickets : `${stats.resolutionRate}%`}</div>
                </div>
                <div className="glass card-hover stat-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{isUser ? 'In Progress' : 'Active Tickets'}</div>
                        <Clock size={20} color="#fbbf24" />
                    </div>
                    <div className="dashboard-card-value" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24' }}>{stats.inProgressTickets}</div>
                </div>
                <div className="glass card-hover stat-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{isUser ? 'Mood Analysis' : 'Avg. Sentiment'}</div>
                        <Sparkles size={20} color="#a855f7" />
                    </div>
                    <div className="dashboard-card-value" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#a855f7' }}>
                        {stats.sentimentDistribution?.length > 0 ? (isUser ? 'Cooperative' : 'Optimal') : '--'}
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="two-column-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginBottom: '25px' }}>
                <div className="glass" style={{ padding: '30px', height: '450px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                         {isUser ? 'My Request History' : 'Weekly Ticket Inflow'}
                    </h3>
                    <div style={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="tickets" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass" style={{ padding: '30px', height: '450px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '25px' }}>Status Breakdown</h3>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="two-column-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div className="glass" style={{ padding: '30px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '25px' }}>{isUser ? 'Problem Categories' : 'Category Analysis'}</h3>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} width={80} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="var(--primary-color)" radius={[0, 10, 10, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass" style={{ padding: '30px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '25px' }}>Priority & Mood</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={priorityData} innerRadius={40} outerRadius={60} dataKey="value">
                                        {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>Priority Distribution</p>
                        </div>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sentimentData} innerRadius={40} outerRadius={60} dataKey="value">
                                        {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>Sentiment Analysis</p>
                        </div>
                    </div>
                    
                    <div style={{ background: mode === 'dark' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.08)', padding: '15px', borderRadius: '14px', marginTop: '10px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={14} color="var(--primary-color)" /> AI {isUser ? 'Assistant' : 'Insight'}
                        </h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            {isUser 
                                ? "We've detected you're mostly requesting technical help. Check the Help Center for faster self-service solutions!"
                                : "Ticket volume has increased in the 'Technical' category this week. We recommend updating your Knowledge Base to address common issues."}
                        </p>
                    </div>
                </div>
            </div>
            {/* Live Monitor / Recent Activity */}
            <div className="glass" style={{ padding: '30px', marginTop: '25px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="var(--primary-color)" /> {isUser ? 'My Ongoing Support' : 'Live Ticket Monitor'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {stats.recentTickets?.length > 0 ? (
                        stats.recentTickets.map((ticket, idx) => (
                            <div key={ticket._id} className="card-hover" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '15px 20px', 
                                borderRadius: '15px', 
                                background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                                border: '1px solid var(--glass-border)',
                                animation: `fadeIn 0.4s ease-out ${idx * 0.1}s forwards`,
                                opacity: 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '10px', 
                                        background: ticket.status === 'resolved' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: ticket.status === 'resolved' ? '#34d399' : 'var(--primary-color)'
                                    }}>
                                        {ticket.status === 'resolved' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{ticket.title}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'capitalize' }}>
                                            {ticket.category} • {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ticket.assignedTo?.name || 'Unassigned'}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>
                                            {ticket.assignedTo?.assignedCategory ? `${ticket.assignedTo.assignedCategory} Specialist` : 'System Queue'}
                                        </div>
                                    </div>
                                    <div style={{ 
                                        padding: '5px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700,
                                        background: ticket.status === 'open' ? 'rgba(251, 191, 36, 0.1)' : ticket.status === 'in-progress' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                                        color: ticket.status === 'open' ? '#fbbf24' : ticket.status === 'in-progress' ? '#6366f1' : '#34d399',
                                        border: '1px solid currentColor',
                                        minWidth: '94px',
                                        textAlign: 'center'
                                    }}>
                                        {ticket.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                            No active tickets found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
