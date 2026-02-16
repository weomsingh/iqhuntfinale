import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { User, Shield, Mail, Wallet, Upload, Save, CheckCircle } from 'lucide-react';

export default function HunterSettings() {
    const { currentUser, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Form states
    const [username, setUsername] = useState(currentUser?.username || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [expertise, setExpertise] = useState(currentUser?.expertise?.join(', ') || '');

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
            setBio(currentUser.bio || '');
            setExpertise(currentUser.expertise ? currentUser.expertise.join(', ') : '');
        }
    }, [currentUser]);

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const updates = {
                id: currentUser.id,
                username,
                bio,
                expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            await refreshUser();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 animate-fade-in px-4 md:px-0">
            {/* Header */}
            <div className="mb-8 p-8 bg-iq-card border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-iq-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h1 className="text-3xl font-bold text-white mb-2 relative z-10">Operative Profile 🛡️</h1>
                <p className="text-iq-text-secondary relative z-10">Manage your identity and security clearance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-iq-card border border-white/5 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-iq-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-24 h-24 mx-auto bg-iq-surface rounded-full flex items-center justify-center text-iq-primary border-2 border-iq-primary/20 mb-4 shadow-glow relative z-10">
                            <User size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1 relative z-10">{currentUser?.username}</h2>
                        <p className="text-xs text-iq-text-secondary uppercase tracking-widest mb-6 relative z-10">Tier 1 Hunter</p>

                        <div className="text-left space-y-4 relative z-10">
                            <div className="p-3 bg-iq-surface rounded-xl border border-white/5 flex items-center gap-3">
                                <Mail size={16} className="text-iq-text-secondary" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-iq-text-secondary uppercase">Email Encrypted</p>
                                    <p className="text-sm text-white truncate">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-iq-surface rounded-xl border border-white/5 flex items-center gap-3">
                                <Wallet size={16} className="text-iq-text-secondary" />
                                <div>
                                    <p className="text-[10px] text-iq-text-secondary uppercase">Wallet ID</p>
                                    <p className="text-xs text-white font-mono opacity-70 truncate max-w-[150px]">{currentUser?.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleUpdateProfile} className="bg-iq-card border border-white/5 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield size={20} className="text-iq-primary" /> Profile Details
                            </h3>
                            {message && (
                                <span className={`text-xs px-3 py-1 rounded-full ${message.type === 'success' ? 'bg-iq-success/10 text-iq-success' : 'bg-iq-error/10 text-iq-error'}`}>
                                    {message.text}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-iq-text-secondary mb-2">Codename (Username)</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-iq-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-iq-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-iq-text-secondary mb-2">Expertise Tags (Comma separated)</label>
                            <input
                                type="text"
                                value={expertise}
                                onChange={(e) => setExpertise(e.target.value)}
                                placeholder="e.g. Cyber Security, OSINT, Smart Contracts"
                                className="w-full bg-iq-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-iq-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-iq-text-secondary mb-2">Operative Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                placeholder="Describe your skills and experience..."
                                className="w-full bg-iq-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-iq-primary transition-colors resize-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-iq-primary text-black font-bold rounded-xl hover:bg-iq-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
