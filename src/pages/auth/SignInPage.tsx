import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Target, AlertCircle, LogOut, ArrowRight, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const { signInWithGoogle, user, profile, signOut } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isSignUp = location.pathname === '/signup';

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Initiating Google Sign In...');
            await signInWithGoogle();
        } catch (err) {
            console.error('Sign In Error:', err);
            setError('Failed to sign in with Google. Check console for details.');
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        // Stay on page to allow sign in
    };

    // If user is already logged in, show a different view
    if (user && profile) {
        return (
            <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

                <Link to="/" className="mb-8 flex items-center gap-2 group z-10 relative">
                    <Target className="w-8 h-8 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT</span>
                </Link>

                <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10 relative text-center">
                    <div className="w-16 h-16 rounded-full bg-iq-green/10 flex items-center justify-center mx-auto mb-4 border border-iq-green/20">
                        <User className="w-8 h-8 text-iq-green" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Already Signed In</h2>
                    <p className="text-iq-text-secondary mb-6">
                        You are currently logged in as <span className="text-white font-bold">@{profile.username}</span> ({profile.role}).
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(profile.role === 'hunter' ? '/hunter/dashboard' : '/payer/dashboard')}
                            className="w-full py-4 bg-iq-green text-black font-bold rounded-xl hover:bg-[#00ff9d] transition-all flex items-center justify-center gap-2 group"
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full py-4 bg-[#ffffff05] text-[#888] border border-[#ffffff1a] font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out & Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients - Added pointer-events-none */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

            <Link to="/" className="mb-8 flex items-center gap-2 group z-10 relative">
                <Target className="w-8 h-8 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT</span>
            </Link>

            <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10 relative">
                <h2 className="text-3xl font-display font-bold text-center mb-2 text-white">
                    {isSignUp ? 'Join the Hunt' : 'Welcome Back'}
                </h2>
                <p className="text-iq-text-secondary text-center mb-8">
                    {isSignUp ? 'Start your journey as a Hunter or Payer.' : 'Enter the arena where skill hunts money.'}
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    )}
                    {loading ? 'Connecting...' : (isSignUp ? 'Sign Up with Google' : 'Continue with Google')}
                </button>

                <div className="text-center text-sm text-iq-text-secondary">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <Link to={isSignUp ? '/signin' : '/signup'} className="text-iq-green hover:underline font-bold">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
