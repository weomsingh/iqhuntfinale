import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Target, User, Wallet, Loader2 } from 'lucide-react';

const CompleteProfilePage = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<'hunter' | 'payer'>(() => {
        const savedRole = sessionStorage.getItem('iqhunt_role');
        return (savedRole === 'hunter' || savedRole === 'payer') ? savedRole : 'hunter';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nationality, setNationality] = useState<'india' | 'global'>('india');
    const [agreedToCovenant, setAgreedToCovenant] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            // 1. Perform the Upsert
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username,
                    role,
                    email: user.email,
                    nationality,
                    currency: nationality === 'india' ? 'INR' : 'USD',
                    updated_at: new Date().toISOString(),
                });

            if (updateError) {
                console.error("Supabase Upsert Error:", updateError);
                // THROW THE RAW ERROR so we can see it on screen
                throw new Error(`DB Error: ${updateError.message} (${updateError.code})`);
            }

            // 2. Force a Hard Navigation to ensure fresh state
            const target = role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard';
            window.location.href = target;

        } catch (err: any) {
            console.error('Profile Update Error:', err);
            // Display the ACTUAL error message to the user
            setError(err.message || 'Failed to update profile.');
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/signin';
    };

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-50 blur-3xl" />

            {/* Navigation Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
                <button
                    onClick={() => window.location.href = '/'}
                    className="text-sm font-bold text-iq-text-secondary hover:text-white transition-colors"
                >
                    Back to Home
                </button>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                >
                    Cancel Registration
                </button>
            </div>

            <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <Target className="w-10 h-10 text-iq-green mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Identify Yourself</h1>
                    <p className="text-iq-text-secondary">You are authenticated. Complete your registration.</p>
                </div>

                {/* Env Var Warning */}
                {!import.meta.env.VITE_SUPABASE_URL && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm text-center">
                        <p className="font-bold mb-1">⚠️ Configuration Error</p>
                        <p>Missing VITE_SUPABASE_URL. Please add your Supabase keys to your Vercel Project Settings.</p>
                    </div>
                )}

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
                        <p className="text-xs text-iq-text-secondary mt-1">This will be your public handle in the arena.</p>
                    </div>

                    {/* Role Selection Logic - Clean up based on user feedback */}
                    {sessionStorage.getItem('iqhunt_role') ? (
                        <div className="p-4 bg-iq-green/5 border border-iq-green/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {role === 'hunter' ? <User className="w-5 h-5 text-iq-green" /> : <Wallet className="w-5 h-5 text-blue-400" />}
                                <div>
                                    <p className="text-xs text-iq-text-secondary uppercase tracking-wider font-bold">Registering As</p>
                                    <p className={`text-lg font-bold ${role === 'hunter' ? 'text-iq-green' : 'text-blue-400'} capitalize`}>{role}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem('iqhunt_role');
                                    window.location.reload();
                                }}
                                className="text-xs text-iq-text-secondary hover:text-white underline"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Hunter Button */}
                            <button
                                type="button"
                                onClick={() => setRole('hunter')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'hunter'
                                    ? 'bg-iq-green/10 border-iq-green text-iq-green shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                                    : 'bg-white/5 border-white/10 text-iq-text-secondary hover:bg-white/10'
                                    }`}
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
                                    }`}
                            >
                                <Wallet className="w-6 h-6" />
                                <span className="font-bold">Payer</span>
                            </button>
                        </div>
                    )}

                    {/* Location & Currency Selection */}
                    <div>
                        <label className="block text-sm font-bold text-iq-text-secondary mb-3">Region & Currency</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setNationality('india')}
                                className={`px-4 py-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${nationality === 'india'
                                    ? 'bg-white/10 border-white text-white'
                                    : 'bg-iq-black border-iq-border text-iq-text-secondary hover:border-white/50'
                                    }`}
                            >
                                🇮🇳 India (INR)
                            </button>
                            <button
                                type="button"
                                onClick={() => setNationality('global')}
                                className={`px-4 py-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${nationality === 'global'
                                    ? 'bg-white/10 border-white text-white'
                                    : 'bg-iq-black border-iq-border text-iq-text-secondary hover:border-white/50'
                                    }`}
                            >
                                🌍 Global (USD)
                            </button>
                        </div>
                    </div>

                    {/* Covenant Agreement */}
                    <div className="flex items-start gap-3 p-4 bg-iq-secondary/30 rounded-lg border border-iq-border">
                        <div className="flex h-6 items-center">
                            <input
                                id="covenant"
                                type="checkbox"
                                required
                                checked={agreedToCovenant}
                                onChange={(e) => setAgreedToCovenant(e.target.checked)}
                                className="h-5 w-5 rounded border-iq-border bg-iq-black text-iq-green focus:ring-iq-green focus:ring-offset-iq-black"
                            />
                        </div>
                        <div className="text-sm">
                            <label htmlFor="covenant" className="font-medium text-white">
                                I agree to the <a href="/covenant" target="_blank" className="text-iq-green hover:underline">Code of Conduct</a>
                            </label>
                            <p className="text-iq-text-secondary mt-1 text-xs">
                                By joining, I accept the risks. I understand that capital is locked and settlement is final.
                            </p>
                        </div>
                    </div>



                    <button
                        type="submit"
                        disabled={loading || !agreedToCovenant || !username}
                        className="w-full py-4 bg-iq-green text-iq-black font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter the Arena'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
