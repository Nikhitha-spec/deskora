import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(name, email, password);
            navigate('/tickets');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Registration failed.';
            setError(errorMsg);
        }
    };

    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '85vh' }}>
            <div className="glass fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Join Deskora</h2>
                <p style={{ textAlign: 'center', marginBottom: '30px', opacity: 0.7 }}>Create your account to get started</p>
                
                {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
                    
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email address" />
                    
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a strong password" />
                    
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter your password" />
                    
                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', opacity: 0.7 }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
