import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Target, User, Wallet, Loader2 } from 'lucide-react';

const CompleteProfilePage = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<'hunter' | 'payer'>(() => {
        const savedRole = sessionStorage.getItem('iqhunt_role');
        return (savedRole === 'hunter' || savedRole === 'payer') ? savedRole : 'hunter';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        // Timeout safety
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out. Please check your connection.")), 10000)
        );

        try {
            await Promise.race([
                (async () => {
                    // 1. Perform the Upsert
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            username,
                            role,
                            email: user.email,
                            updated_at: new Date().toISOString(),
                        });

                    if (updateError) throw updateError;

                    // 2. Force a Hard Navigation to ensure fresh state
                    // This bypasses any React Context lag and ensures AuthContext re-initializes correctly
                    const target = role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard';
                    window.location.href = target;
                })(),
                timeoutPromise
            ]);

        } catch (err: any) {
            console.error('Profile Update Error:', err);
            setError(err.message || 'Failed to update profile.');
            setLoading(false); // Only stop loading on error, on success we redirect
        }
    };

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-50 blur-3xl" />

            <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <Target className="w-10 h-10 text-iq-green mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Identify Yourself</h1>
                    <p className="text-iq-text-secondary">Choose your path and claim your handle.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-iq-text-secondary mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none font-mono"
                            placeholder="e.g. GhostHunter01"
                        />
                    </div>

                    {/* Role Selection - Simplified if pre-selected */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Hunter Button */}
                        <button
                            type="button"
                            onClick={() => setRole('hunter')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'hunter'
                                ? 'bg-iq-green/10 border-iq-green text-iq-green shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                                : 'bg-white/5 border-white/10 text-iq-text-secondary hover:bg-white/10'
                                } ${sessionStorage.getItem('iqhunt_role') === 'payer' ? 'opacity-50 grayscale cursor-not-allowed hidden' : ''}`}
                            disabled={sessionStorage.getItem('iqhunt_role') === 'payer'}
                        >
                            <User className="w-6 h-6" />
                            <span className="font-bold">Hunter</span>
                        </button>

                        {/* Payer Button */}
                        <button
                            type="button"
                            onClick={() => setRole('payer')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'payer'
                                ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.2)]'
                                : 'bg-white/5 border-white/10 text-iq-text-secondary hover:bg-white/10'
                                } ${sessionStorage.getItem('iqhunt_role') === 'hunter' ? 'opacity-50 grayscale cursor-not-allowed hidden' : ''}`}
                            disabled={sessionStorage.getItem('iqhunt_role') === 'hunter'}
                        >
                            <Wallet className="w-6 h-6" />
                            <span className="font-bold">Payer</span>
                        </button>
                    </div>

                    {/* Change Role Link if pre-selected */}
                    {sessionStorage.getItem('iqhunt_role') && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem('iqhunt_role');
                                    // Force re-render/reset is handled by React state, but we need to unlock UI
                                    // A simple reload is easiest to clear state, or just clearing storage and updating state
                                    window.location.reload();
                                }}
                                className="text-xs text-iq-text-secondary hover:text-white underline"
                            >
                                Not a {role === 'hunter' ? 'Hunter' : 'Payer'}? Switch Role
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-iq-green text-iq-black font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter the Arena'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
