import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading analytics...</div>;

    if (!stats) return null;

    const chartData = [
        { name: 'Open', value: stats.openTickets, color: '#fbbf24' },
        { name: 'In Progress', value: stats.inProgressTickets, color: '#6366f1' },
        { name: 'Resolved', value: stats.resolvedTickets, color: '#34d399' },
    ];

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass card-hover" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.6 }}>Total Tickets</div>
                        <BarChart3 size={20} color="#6366f1" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.totalTickets}</div>
                </div>
                <div className="glass card-hover" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.6 }}>Resolved</div>
                        <CheckCircle2 size={20} color="#34d399" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399' }}>{stats.resolvedTickets}</div>
                </div>
                <div className="glass card-hover" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.6 }}>Resolution Rate</div>
                        <TrendingUp size={20} color="#60a5fa" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#60a5fa' }}>{stats.resolutionRate}%</div>
                </div>
                <div className="glass card-hover" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ opacity: 0.6 }}>Active workload</div>
                        <AlertTriangle size={20} color="#fbbf24" />
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24' }}>{stats.activeWorkload}</div>
                </div>
            </div>

            <div className="two-column-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '400px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Ticket Distribution</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '10px', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="glass" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Performance Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: 600 }}>Resolved Rate</span>
                                <span style={{ color: '#34d399' }}>{stats.resolutionRate || 0}%</span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${stats.resolutionRate || 0}%`, background: '#34d399', transition: 'width 1.5s ease-in-out' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: 600 }}>In Progress</span>
                                <span style={{ color: '#6366f1' }}>{stats.totalTickets ? Math.round((stats.inProgressTickets / stats.totalTickets) * 100) : 0}%</span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${stats.totalTickets ? Math.round((stats.inProgressTickets / stats.totalTickets) * 100) : 0}%`, background: '#6366f1', transition: 'width 1.5s ease-in-out' }}></div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '16px', marginTop: '10px' }}>
                            <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} color="var(--primary-color)" /> AI Efficiency Tip
                            </h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5 }}>
                                You're resolving tickets 15% faster using AI co-pilot suggestions this week! Keep utilizing the 'Ask AI' feature to maintain this momentum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
