import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import KnowledgeBase from './pages/KnowledgeBase';
import AIChatBot from './components/AIChatBot';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user && (user.role === 'Admin' || user.role === 'Agent') ? children : <Navigate to="/tickets" />;
}

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="container">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute><TicketList /></PrivateRoute>} />
                        <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
                        <Route path="/tickets/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/kb" element={<PrivateRoute><KnowledgeBase /></PrivateRoute>} />
                    </Routes>
                    <AIChatBot />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
