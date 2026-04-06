import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, Mail, Info, Save } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        gender: '',
        location: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await API.put('/auth/profile', profile);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>User Profile</h1>
            
            <div className="two-column-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div className="glass" style={{ padding: '30px', textAlign: 'center', height: 'fit-content' }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%', 
                        background: 'var(--primary-color)', 
                        margin: '0 auto 20px',
                        display: 'grid',
                        placeItems: 'center'
                    }}>
                        <User size={50} color="white" />
                    </div>
                    <h2 style={{ marginBottom: '5px' }}>{profile.name}</h2>
                    <div style={{ opacity: 0.6, fontSize: '0.9rem', textTransform: 'capitalize' }}>{profile.role}</div>
                    
                    <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '20px', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                            <Mail size={16} opacity={0.6} /> {profile.email}
                        </div>
                        {profile.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                <MapPin size={16} opacity={0.6} /> {profile.location}
                            </div>
                        )}
                        {profile.role === 'Agent' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                <Briefcase size={16} opacity={0.6} /> Specialty: {profile.assignedCategory}
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '25px' }}>Edit Information</h3>
                    {message && <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '10px', borderRadius: '8px', marginBottom: '15px', color: '#34d399' }}>{message}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Name</label>
                                <input name="name" value={profile.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Gender</label>
                                <select name="gender" value={profile.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        { (profile.role === 'Agent' || profile.role === 'Admin') && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Assigned Specialty (Routing)</label>
                                <select 
                                    name="assignedCategory" 
                                    value={profile.assignedCategory || ''} 
                                    onChange={handleChange}
                                    style={{ border: '1px solid var(--primary-color)', background: 'rgba(99, 102, 241, 0.05)' }}
                                >
                                    <option value="">No Specialty (General Fallback)</option>
                                    <option value="billing">Billing Specialist</option>
                                    <option value="technical">Technical Engineer</option>
                                    <option value="general">General Support</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Location</label>
                            <input name="location" value={profile.location} onChange={handleChange} placeholder="e.g. New York, USA" />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', display: 'block' }}>Bio</label>
                            <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Tell us about yourself..." />
                        </div>

                        <button type="submit" disabled={updating} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                            <Save size={18} /> {updating ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
