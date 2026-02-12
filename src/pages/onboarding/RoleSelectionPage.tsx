
import { Target, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
    const navigate = useNavigate();

    const selectRole = (role: 'hunter' | 'payer') => {
        // Navigate to profile completion with selected role
        navigate(`/onboarding/profile?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-iq-black flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Choose Your Path</h1>
            <p className="text-iq-text-secondary mb-12 text-center max-w-xl">
                Every legend starts with a choice. Will you hunt for glory, or deploy capital to build empires?
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Hunter Card */}
                <button
                    onClick={() => selectRole('hunter')}
                    className="group relative p-8 rounded-2xl bg-iq-secondary/30 border border-iq-border hover:border-iq-green transition-all text-left hover:bg-iq-secondary/50"
                >
                    <div className="absolute inset-0 bg-iq-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="w-16 h-16 bg-iq-green/10 rounded-2xl flex items-center justify-center text-iq-green mb-6 group-hover:scale-110 transition-transform">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Join as Hunter</h2>
                    <p className="text-iq-text-secondary">
                        Compete for bounties, build your reputation, and earn instant payouts.
                    </p>
                </button>

                {/* Payer Card */}
                <button
                    onClick={() => selectRole('payer')}
                    className="group relative p-8 rounded-2xl bg-iq-secondary/30 border border-iq-border hover:border-iq-green transition-all text-left hover:bg-iq-secondary/50"
                >
                    <div className="absolute inset-0 bg-iq-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Join as Payer</h2>
                    <p className="text-iq-text-secondary">
                        Post bounties, access top talent, and build with speed and security.
                    </p>
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
