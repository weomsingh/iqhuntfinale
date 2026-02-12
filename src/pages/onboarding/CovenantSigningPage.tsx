import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import CovenantPage from '../CovenantPage'; // Reuse the text component

const CovenantSigningPage = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignOath = async () => {
        if (!user || !agreed) return;
        setLoading(true);

        try {
            // Update profile
            const { error } = await supabase
                .from('profiles')
                .update({ accepted_covenant: true })
                .eq('id', user.id);

            if (error) throw error;

            // Refresh context profile to update routing logic
            await refreshProfile();

            // Determine destination based on role (fetch fresh because context might lag slightly)
            const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();

            if (data?.role === 'hunter') {
                navigate('/hunter/dashboard');
            } else {
                navigate('/payer/dashboard');
            }

        } catch (error) {
            console.error('Error signing covenant:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-iq-black flex flex-col">
            <div className="flex-grow overflow-y-auto">
                <CovenantPage />
            </div>

            <div className="sticky bottom-0 bg-iq-black/90 backdrop-blur-lg border-t border-iq-border p-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="accept"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-5 h-5 rounded border-iq-border bg-iq-secondary text-iq-green focus:ring-iq-green"
                        />
                        <label htmlFor="accept" className="text-white cursor-pointer select-none">
                            I have read and I accept the Digital Blood Oath
                        </label>
                    </div>

                    <button
                        onClick={handleSignOath}
                        disabled={!agreed || loading}
                        className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${agreed
                            ? 'bg-iq-green text-iq-black hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                            : 'bg-iq-secondary text-iq-text-secondary cursor-not-allowed'
                            }`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Arena'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CovenantSigningPage;
