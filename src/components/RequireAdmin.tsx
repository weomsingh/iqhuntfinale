import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAILS = ['admin@iqhunt.com', 'demo@iqhunt.com']; // Replace with actual admin emails

interface RequireAdminProps {
    children: React.ReactElement;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-iq-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-iq-green animate-spin" />
            </div>
        );
    }

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        // Redirect non-admins to home or signin
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAdmin;
