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
    const savedRole = sessionStorage.getItem('iqhunt_role');
    const isRolePreselected = !!savedRole && (savedRole === 'hunter' || savedRole === 'payer');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        const upsertProfile = async (retryCount = 0) => {
            try {
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

                if (updateError) throw updateError;
                return true;
            } catch (err) {
                if (retryCount < 2) { // 3 attempts total
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                    return upsertProfile(retryCount + 1);
                }
                throw err;
            }
        };

        try {
            await upsertProfile();

            // Clear session storage strictly after success
            sessionStorage.removeItem('iqhunt_role');

            // Force navigation to the correct landing page
            // HUNTERS go to ARENA, PAYERS go to DASHBOARD
            const target = role === 'hunter' ? '/hunter/arena' : '/payer/dashboard';

            // Use replace to prevent back-button loops
            window.location.replace(target);

        } catch (err: any) {
            console.error('Profile Update Error:', err);
            setError(err.message || 'Failed to update profile. Please check your connection.');
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

            {/* Navigation Controls - "Back to Home" ONLY */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
                <button
                    onClick={() => window.location.href = '/'}
                    className="text-sm font-bold text-iq-text-secondary hover:text-white transition-colors"
                >
                    Back to Home
                </button>
                {/* Cancel/Sign Out button REMOVED as requested */}
            </div>

            <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <Target className="w-10 h-10 text-iq-green mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Identify Yourself</h1>
                    <p className="text-iq-text-secondary">
                        Joining as <span className="text-white font-bold uppercase">{role}</span>. Complete your profile.
                    </p>
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

                    {/* Role Selection - HIDDEN if pre-selected, visible otherwise */}
                    {!isRolePreselected && (
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
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : 'Enter the Arena'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
