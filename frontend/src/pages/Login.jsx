import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/tickets');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '80vh' }}>
            <div className="glass fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', marginBottom: '30px', opacity: 0.7 }}>Log in to Deskora management</p>
                
                {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                    
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                    
                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', opacity: 0.7 }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
