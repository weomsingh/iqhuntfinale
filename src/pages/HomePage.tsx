
import { Target, Shield, ArrowRight, Wallet, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="bg-iq-black min-h-screen">
            {/* Hero Section */}
            <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-iq-green/10 via-transparent to-transparent opacity-50 blur-3xl" />
                <div className="z-10 max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iq-secondary border border-iq-border animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-iq-green animate-pulse" />
                        <span className="text-sm text-iq-text-secondary">Live: 34 Active Bounties</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        THE TRIANGLE OF TRUST
                    </h1>

                    <p className="text-xl md:text-2xl text-iq-text-secondary max-w-2xl mx-auto">
                        Three Pillars. Zero Bullshit. <br />
                        <span className="text-iq-green">Where skill hunts money.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link
                            to="/signup?role=hunter"
                            className="px-8 py-4 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2 group"
                        >
                            <Target className="w-5 h-5" />
                            Stake Your Skill
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/signup?role=payer"
                            className="px-8 py-4 bg-transparent border border-iq-green text-iq-green font-bold rounded-lg hover:bg-iq-green/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Wallet className="w-5 h-5" />
                            Deploy Capital
                        </Link>
                    </div>
                </div>
            </section>

            {/* Three Pillars Section */}
            <section className="px-6 py-20 border-t border-iq-border bg-iq-secondary/30">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {/* Pillar 1 */}
                    <div className="p-8 rounded-2xl bg-iq-black/50 border border-iq-border hover:border-iq-green/50 transition-colors group">
                        <div className="w-12 h-12 bg-iq-green/10 rounded-xl flex items-center justify-center text-iq-green mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-sm font-mono text-iq-green">01</span>
                            <h3 className="text-xl text-iq-text font-bold">Locked Vault</h3>
                        </div>
                        <p className="text-iq-text-secondary leading-relaxed">
                            Every bounty is backed by 105% pre-funded capital. Hunters know the money exists before they even start.
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="p-8 rounded-2xl bg-iq-black/50 border border-iq-border hover:border-iq-green/50 transition-colors group">
                        <div className="w-12 h-12 bg-iq-green/10 rounded-xl flex items-center justify-center text-iq-green mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-sm font-mono text-iq-green">02</span>
                            <h3 className="text-xl text-iq-text font-bold">The Stake</h3>
                        </div>
                        <p className="text-iq-text-secondary leading-relaxed">
                            Hunters pay a small stake to enter. This kills spam, bots, and amateurs. Only serious operators compete.
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="p-8 rounded-2xl bg-iq-black/50 border border-iq-border hover:border-iq-green/50 transition-colors group">
                        <div className="w-12 h-12 bg-iq-green/10 rounded-xl flex items-center justify-center text-iq-green mb-6 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-sm font-mono text-iq-green">03</span>
                            <h3 className="text-xl text-iq-text font-bold">Instant Settlement</h3>
                        </div>
                        <p className="text-iq-text-secondary leading-relaxed">
                            Winner selected? Funds move in 300 seconds. No pending periods. No 14-day clearance. Speed is the ultimate respect.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Grid */}
            <section className="px-6 py-20 relative">
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
