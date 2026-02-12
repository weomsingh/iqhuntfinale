import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    useEffect(() => {
        // If we have a session, decide where to go
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/signin');
                return;
            }

            // If we have a profile, go to dashboard
            // If NOT (first time user), go to onboarding
            if (profile) {
                navigate(profile.role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard');
            } else {
                // We might need to wait for the profile fetch in context, 
                // or purely check DB here if context is slow.
                // For now, let's assume if context doesn't have it, we check DB
                checkProfileExistence(session.user.id);
            }
        });
    }, [navigate]);

    const checkProfileExistence = async (userId: string) => {
        const { data } = await supabase.from('profiles').select('id, role').eq('id', userId).single();
        if (data) {
            navigate(data.role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard');
        } else {
            navigate('/onboarding/role');
        }
    };

    return (
        <div className="min-h-screen bg-iq-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iq-green"></div>
        </div>
    );
};

export default AuthCallback;
