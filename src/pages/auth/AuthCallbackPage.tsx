import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (profile) {
                    // Profile exists, redirect to respective dashboard
                    if (profile.role === 'hunter') {
                        navigate('/hunter/dashboard');
                    } else if (profile.role === 'payer') {
                        navigate('/payer/dashboard');
                    } else {
                        // Fallback
                        navigate('/');
                    }
                } else {
                    // No profile, redirect to onboarding
                    navigate('/complete-profile');
                }
            } else {
                // No user found after loading, redirect to signin
                navigate('/signin');
            }
        }
    }, [user, profile, loading, navigate]);

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-4">
            <Loader2 className="w-10 h-10 text-iq-green animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">Authenticating...</h2>
            <p className="text-iq-text-secondary">Securing your connection to the grid.</p>
        </div>
    );
};

export default AuthCallbackPage;
