import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
    children: React.ReactElement;
    allowedRole?: 'hunter' | 'payer';
}

const RequireAuth = ({ children, allowedRole }: RequireAuthProps) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-iq-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-iq-green animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (profile && allowedRole && profile.role !== allowedRole) {
        // Redirect to their appropriate dashboard if they try to access wrong area
        // e.g. Hunter tries to access Payer dashboard
        const dashboard = profile.role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard';
        return <Navigate to={dashboard} replace />;
    }

    // If user exists but no profile (incomplete onboarding), redirect to role selection
    // EXCEPT if they are already on onboarding pages (handled by App routing structure)
    if (!profile) {
        return <Navigate to="/onboarding/role" replace />;
    }

    return children;
};

export default RequireAuth;
