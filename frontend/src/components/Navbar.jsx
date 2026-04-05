import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, LayoutDashboard, Ticket, MessageSquare, Sun, Moon, HelpCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout, mode, toggleTheme } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="glass fade-in" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 30px', 
            marginBottom: '30px',
            position: 'sticky',
            top: '20px',
            zIndex: 100,
            margin: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'var(--primary-color)', 
                    borderRadius: '8px',
                    display: 'grid',
                    placeItems: 'center'
                }}>
                    <MessageSquare size={18} color="white" />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Deskora</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {(user.role === 'Admin' || user.role === 'Agent') && (
                    <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}>
                        <LayoutDashboard size={18} /> <span>Dashboard</span>
                    </Link>
                )}
                <Link to="/tickets" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}>
                    <Ticket size={18} /> <span>Tickets</span>
                </Link>
                <Link to="/kb" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}>
                    <HelpCircle size={18} /> <span>Help Center</span>
                </Link>
                <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}>
                    <UserIcon size={18} /> <span>Profile</span>
                </Link>

                <div 
                    onClick={toggleTheme} 
                    style={{ cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center' }}
                >
                    {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </div>

                <div 
                    onClick={handleLogout} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600 }}
                >
                    <LogOut size={18} /> Logout
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
