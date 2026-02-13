import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertTriangle, LogOut, ArrowRight } from 'lucide-react';

interface RequireAuthProps {
    children: React.ReactElement;
    allowedRole?: 'hunter' | 'payer';
}

const RequireAuth = ({ children, allowedRole }: RequireAuthProps) => {
    const { user, profile, loading, signOut } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-iq-green animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Role Mismatch Handling
    if (profile && allowedRole && profile.role !== allowedRole) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#111] border border-[#ffffff1a] rounded-2xl p-8 text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                        <p className="text-[#888]">
                            You are currently logged in as a <span className="text-white font-bold capitalize">{profile.role}</span> (@{profile.username}),
                            but this page is restricted to <span className="text-white font-bold capitalize">{allowedRole}s</span>.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a
                            href={profile.role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard'}
                            className="w-full py-3 rounded-xl bg-iq-green text-[#0a0a0a] font-bold hover:bg-[#00ff9d] transition-all flex items-center justify-center gap-2"
                        >
                            Go to {profile.role === 'hunter' ? 'Hunter' : 'Payer'} Dashboard <ArrowRight className="w-4 h-4" />
                        </a>

                        <button
                            onClick={() => signOut()}
                            className="w-full py-3 rounded-xl bg-[#ffffff05] text-[#888] border border-[#ffffff1a] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out & Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};

export default RequireAuth;
