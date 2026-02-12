import { Wallet, Trophy, Target, Star, ArrowUpRight, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HunterDashboard = () => {
    const { profile } = useAuth();

    // Dummy data for visual development
    const stats = [
        { label: 'Wallet Balance', value: `₹${profile?.wallet_balance || 0}`, icon: Wallet, color: 'text-iq-green' },
        { label: 'Total Earnings', value: '₹45,200', icon: Trophy, color: 'text-yellow-400' },
        { label: 'Active Missions', value: '2', icon: Target, color: 'text-blue-400' },
        { label: 'Win Rate', value: '68%', icon: Star, color: 'text-purple-400' },
    ];

    const activeMissions = [
        {
            id: 1,
            title: 'Fintech Dashboard UI Design',
            reward: 15000,
            deadline: '2 days',
            status: 'In Progress',
        },
        {
            id: 2,
            title: 'React Component Library',
            reward: 8000,
            deadline: '5 hours',
            status: 'Submitted',
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-iq-text-secondary">Welcome back, Hunter. The arena awaits.</p>
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
                    <button className="text-sm text-iq-green hover:underline">View All</button>
                </div>

                {activeMissions.length > 0 ? (
                    <div className="grid gap-4">
                        {activeMissions.map((mission) => (
                            <div key={mission.id} className="p-6 bg-iq-secondary/20 rounded-xl border border-iq-border flex items-center justify-between group hover:bg-iq-secondary/40 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-iq-green/10 rounded-lg text-iq-green">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-iq-green transition-colors">{mission.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-iq-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {mission.deadline} left
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${mission.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {mission.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-iq-green">₹{mission.reward.toLocaleString()}</p>
                                    <p className="text-xs text-iq-text-secondary">Reward</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center border border-dashed border-iq-border rounded-xl">
                        <Target className="w-12 h-12 text-iq-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">No Active Missions</h3>
                        <p className="text-iq-text-secondary mb-6">You haven't joined any hunts yet.</p>
                        <button className="px-6 py-2 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all">
                            Browse Arena
                        </button>
                    </div>
                )}
            </div>

            {/* Recent Activity Feed Placeholder */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-6 bg-iq-secondary/30 rounded-xl border border-iq-border">
                    <h3 className="font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 pb-4 border-b border-iq-border last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-iq-green mt-2 shrink-0" />
                                <div>
                                    <p className="text-sm">You joined <span className="text-white font-medium">Mobile App Redesign</span></p>
                                    <p className="text-xs text-iq-text-secondary">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-iq-green/20 to-transparent rounded-xl border border-iq-green/30 flex flex-col justify-center items-center text-center">
                    <Trophy className="w-12 h-12 text-iq-green mb-4" />
                    <h3 className="font-bold text-xl mb-2">Pro Hunter Status</h3>
                    <p className="text-sm text-iq-text-secondary mb-4">Win 3 more bounties to unlock Pro badge and lower fees.</p>
                    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                        <div className="bg-iq-green h-full w-[70%]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HunterDashboard;
