import { useEffect } from 'react';
import { Target, Shield, ArrowRight, Wallet, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
    const { user, profile } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#how-it-works') {
            const element = document.getElementById('how-it-works');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div className="bg-iq-black min-h-screen">
            {/* Hero Section */}
            <section className="relative px-6 py-32 md:py-48 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-40 blur-3xl" />

                <div className="z-10 max-w-5xl mx-auto space-y-12">

                    {/* Main Title - Massive Typography */}
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
                        <span className="text-white block">WHERE SKILL</span>
                        <span className="bg-gradient-to-b from-iq-green to-emerald-600 bg-clip-text text-transparent block mt-2 filter drop-shadow-[0_0_30px_rgba(0,255,157,0.3)]">
                            HUNTS MONEY.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-iq-text-secondary max-w-2xl mx-auto font-light tracking-wide">
                        A private competitive arena for skilled individuals. <br className="hidden md:block" />
                        <span className="text-white font-medium">Deploy capital. Stake your skill. Extract the reward.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-md mx-auto sm:max-w-none">
                        <Link
                            to="/hunter/dashboard"
                            onClick={() => !user && sessionStorage.setItem('iqhunt_role', 'hunter')}
                            className="px-8 py-5 bg-iq-green text-iq-black font-black text-lg tracking-wider rounded-lg hover:shadow-[0_0_40px_rgba(0,255,157,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3 group uppercase"
                        >
                            {user && profile?.role === 'hunter' ? 'Go to Dashboard' : 'Enter as Hunter'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/payer/post-bounty"
                            onClick={() => !user && sessionStorage.setItem('iqhunt_role', 'payer')}
                            className="px-8 py-5 bg-transparent border-2 border-zinc-800 text-white font-bold text-lg tracking-wider rounded-lg hover:border-iq-green hover:text-iq-green hover:bg-iq-green/5 transition-all flex items-center justify-center gap-3 uppercase"
                        >
                            Post a Bounty (Payer Only)
                        </Link>
                    </div>
                </div>
            </section>

            {/* Three Pillars Section - Redesigned */}
            <section className="px-6 py-32 bg-iq-black border-t border-iq-border relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-20" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-xs font-bold tracking-[0.2em] text-iq-text-secondary uppercase">
                            The Triangle of Trust
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                            Three Pillars. <span className="text-iq-green">Zero Bullshit.</span>
                        </h2>
                        <p className="text-iq-text-secondary max-w-2xl mx-auto text-lg pt-4">
                            Every hunt is backed by locked capital, filtered by stakes, <br className="hidden md:block" />
                            and settled at lightning speed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-iq-green/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-iq-green mb-8 group-hover:scale-110 transition-transform border border-zinc-700/50 group-hover:border-iq-green/30">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl text-white font-bold">Locked Vault</h3>
                                <span className="text-4xl font-black text-zinc-800 group-hover:text-iq-green/10 transition-colors">01</span>
                            </div>
                            <h4 className="text-xs font-bold text-iq-text-secondary tracking-widest uppercase mb-4">Capital Security</h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                Every bounty is backed by 105% pre-funded capital. Hunters know the money exists before they even commit.
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-iq-green/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-iq-green mb-8 group-hover:scale-110 transition-transform border border-zinc-700/50 group-hover:border-iq-green/30">
                                <Target className="w-6 h-6" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl text-white font-bold">The Stake</h3>
                                <span className="text-4xl font-black text-zinc-800 group-hover:text-iq-green/10 transition-colors">02</span>
                            </div>
                            <h4 className="text-xs font-bold text-iq-text-secondary tracking-widest uppercase mb-4">Quality Filter</h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                Hunters pay a small stake to enter. This kills spam, bots, and amateurs. Only serious operators compete.
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-iq-green/50 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-iq-green mb-8 group-hover:scale-110 transition-transform border border-zinc-700/50 group-hover:border-iq-green/30">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl text-white font-bold">Instant Settlement</h3>
                                <span className="text-4xl font-black text-zinc-800 group-hover:text-iq-green/10 transition-colors">03</span>
                            </div>
                            <h4 className="text-xs font-bold text-iq-text-secondary tracking-widest uppercase mb-4">Speed Protocol</h4>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                Winner selected? Funds move in 300 seconds. No pending periods. No 14-day clearance delays.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Grid */}
            <section id="how-it-works" className="px-6 py-20 relative pt-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-iq-text-secondary">Simplicity is the ultimate sophistication.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Hunter Flow */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-iq-green flex items-center gap-2">
                                <Target className="w-6 h-6" /> For Hunters
                            </h3>
                            <div className="space-y-6 border-l-2 border-iq-border ml-3 pl-8">
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Find Bounty</h4>
                                    <p className="text-iq-text-secondary">Browse active missions that match your expertise.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Pay Stake</h4>
                                    <p className="text-iq-text-secondary">Lock in your slot (₹10-299). Skin in the game.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Execute & Win</h4>
                                    <p className="text-iq-text-secondary">Submit work. Top submission wins instantly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Payer Flow */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-iq-green flex items-center gap-2">
                                <Wallet className="w-6 h-6" /> For Payers
                            </h3>
                            <div className="space-y-6 border-l-2 border-iq-border ml-3 pl-8">
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Post Bounty</h4>
                                    <p className="text-iq-text-secondary">Define requirements and clear deliverables.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Lock Capital</h4>
                                    <p className="text-iq-text-secondary">105% pre-funding required. No fake projects.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-iq-black border-2 border-iq-green z-10" />
                                    <h4 className="text-lg font-bold text-iq-text">Select Winner</h4>
                                    <p className="text-iq-text-secondary">Review curated submissions. Funds auto-transfer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
