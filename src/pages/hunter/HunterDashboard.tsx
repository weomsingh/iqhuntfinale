import { Wallet, Trophy, Target, Star, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HunterDashboard = () => {
    const { profile } = useAuth();

    const stats = [
        { label: 'Wallet Balance', value: `₹${profile?.wallet_balance?.toLocaleString() || 0}`, icon: Wallet, color: 'text-iq-green' },
        { label: 'Total Earnings', value: '₹0', icon: Trophy, color: 'text-yellow-400' }, // Placeholder until transaction table linked
        { label: 'Active Missions', value: '0', icon: Target, color: 'text-blue-400' },   // Placeholder
        { label: 'Win Rate', value: '0%', icon: Star, color: 'text-purple-400' },         // Placeholder
    ];

    // TODO: Fetch real active missions from 'bounty_participants' table
    const activeMissions: any[] = [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, <span className="text-iq-green">{profile?.username}</span>
                </h1>
                <p className="text-iq-text-secondary">The arena awaits your skill.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-iq-secondary/30 rounded-xl border border-iq-border hover:border-iq-green/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-iq-text-secondary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-iq-text-secondary">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Active Missions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Active Missions</h2>
                </div>

                {activeMissions.length > 0 ? (
                    <div className="grid gap-4">
                        {/* Map real missions here */}
                    </div>
                ) : (
                    <div className="p-12 text-center border border-dashed border-iq-border rounded-xl">
                        <Target className="w-12 h-12 text-iq-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">No Active Missions</h3>
                        <p className="text-iq-text-secondary mb-6">You haven't joined any hunts yet.</p>
                        <Link to="/bounties" className="inline-block px-6 py-2 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all">
                            Browse Arena
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HunterDashboard;
