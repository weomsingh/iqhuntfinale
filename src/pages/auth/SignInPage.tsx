import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Target, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    const { signInWithGoogle } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            setError('Failed to sign in with Google. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-50 blur-3xl" />

            <Link to="/" className="mb-8 flex items-center gap-2 group z-10">
                <Target className="w-8 h-8 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT</span>
            </Link>

            <div className="w-full max-w-md bg-iq-secondary/50 backdrop-blur-md border border-iq-border rounded-2xl p-8 shadow-2xl z-10">
                <h2 className="text-3xl font-display font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-iq-text-secondary text-center mb-8">Enter the arena where skill hunts money.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    Continue with Google
                </button>

                <div className="text-center text-sm text-iq-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-iq-green hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
