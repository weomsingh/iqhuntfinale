import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
    const { user, profile, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [conflictData, setConflictData] = useState<{ intended: string, actual: string } | null>(null);

    useEffect(() => {
        const handleAuthLogic = async () => {
            if (!loading) {
                if (user) {
                    // Check for intended role from localStorage
                    const intendedRole = window.localStorage.getItem('iqhunt_intended_role');

                    // Clean up localStorage immediately to prevent stale state
                    // But keep it in local var for checking

                    if (profile) {
                        // Profile exists - check for role conflict
                        if (intendedRole && intendedRole !== profile.role) {
                            // CONFLICT DETECTED
                            setConflictData({
                                intended: intendedRole,
                                actual: profile.role
                            });
                            // Remove item now that we viewed it
                            window.localStorage.removeItem('iqhunt_intended_role');
                            return; // Stop redirection, show UI
                        }

                        // No conflict, safe to redirect
                        window.localStorage.removeItem('iqhunt_intended_role');
                        if (profile.role === 'hunter') {
                            navigate('/hunter/dashboard');
                        } else if (profile.role === 'payer') {
                            navigate('/payer/dashboard');
                        } else {
                            navigate('/');
                        }
                    } else {
                        // No profile, redirect to onboarding
                        // Pass intended role if available via state or letting CompleteProfilePage read it?
                        // CompleteProfilePage handles selection, but we can pass a hint if needed.
                        // Ideally CompleteProfilePage should read intended_role or let user choose.
                        // For now just redirect.
                        navigate('/complete-profile');
                    }
                } else {
                    // No user found, redirect
                    navigate('/signin');
                }
            }
        };

        handleAuthLogic();
    }, [user, profile, loading, navigate]);

    if (conflictData) {
        return (
            <div className="min-h-screen bg-iq-black flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#111] border border-red-500/30 rounded-2xl p-8 text-center space-y-6 animate-fade-in shadow-[0_0_50px_rgba(255,82,82,0.1)]">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                        {/* Using a generic alert icon or text since imports might vary */}
                        <span className="text-4xl">⚠️</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Account Already Exists</h2>
                        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-left">
                            <p className="text-gray-300 text-sm mb-2">
                                This email is already registered as a <span className="text-white font-bold uppercase">{conflictData.actual}</span>.
                            </p>
                            <p className="text-gray-400 text-xs">
                                You cannot use the same email for multiple roles. You tried to sign in as a <span className="text-red-400 font-bold uppercase">{conflictData.intended}</span>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                // Continue to actual dashboard
                                if (conflictData.actual === 'hunter') navigate('/hunter/dashboard');
                                else navigate('/payer/dashboard');
                            }}
                            className="w-full py-3 rounded-xl bg-iq-green text-[#0a0a0a] font-bold hover:bg-[#00ff9d] transition-all"
                        >
                            Continue as {conflictData.actual.toUpperCase()}
                        </button>

                        <button
                            onClick={async () => {
                                await signOut();
                                navigate('/signin');
                            }}
                            className="w-full py-3 rounded-xl bg-[#ffffff05] text-[#888] border border-[#ffffff1a] hover:bg-white/5 hover:text-white transition-all"
                        >
                            Log Out & Use Different Email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-4">
            <Loader2 className="w-10 h-10 text-iq-green animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">Authenticating...</h2>
            <p className="text-iq-text-secondary">Securing your connection to the grid.</p>
        </div>
    );
};

export default AuthCallbackPage;
