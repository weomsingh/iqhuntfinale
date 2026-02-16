import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import BountyCard from '../../components/BountyCard';
import { Target, Trophy, TrendingUp, Clock, ArrowRight, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export default function HunterDashboard() {
    const { currentUser } = useAuth();
    const [activeStake, setActiveStake] = useState(null);
    const [recentBounties, setRecentBounties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadDashboardData();
        }
    }, [currentUser]);

    async function loadDashboardData() {
        try {
            // Get active stake
            const { data: stakes } = await supabase
                .from('hunter_stakes')
                .select(`
                    *,
                    bounty:bounties(*)
                `)
                .eq('hunter_id', currentUser.id)
                .eq('status', 'active')
                .single();

            if (stakes) setActiveStake(stakes);

            // Get recent live bounties
            const { data: bounties } = await supabase
                .from('bounties')
                .select('*')
                .eq('status', 'live')
                .order('created_at', { ascending: false })
                .limit(6);

            setRecentBounties(bounties || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-iq-primary border-t-transparent animate-spin ml-2"></div>
                <span className="ml-2 text-iq-text-secondary">Loading HQ...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Welcome back, <span className="text-iq-primary">{currentUser?.username}</span>! 👋
                    </h1>
                    <p className="text-iq-text-secondary mt-1">
                        Here's your mission report for today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-iq-surface border border-white/5 flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-white">{currentUser?.hunts_won || 0} Wins</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-iq-surface border border-white/5 flex items-center gap-2">
                        <Zap size={16} className="text-iq-primary" />
                        <span className="text-sm font-medium text-white">{currentUser?.success_rate?.toFixed(0) || 0}% Rate</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <WalletCardIcon size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">{currency}{(currentUser?.total_earnings || 0).toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Target size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Active Hunts</p>
                    <p className="text-2xl font-bold text-iq-primary">{activeStake ? 1 : 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Completed</p>
                    <p className="text-2xl font-bold text-iq-accent">{currentUser?.hunts_completed || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Pending</p>
                    <p className="text-2xl font-bold text-iq-warning">0</p>
                </div>
            </div>

            {/* Active Mission Card */}
            {activeStake ? (
                <div className="p-1 rounded-2xl bg-gradient-to-r from-iq-primary/20 to-iq-accent/20">
                    <div className="bg-iq-card rounded-xl p-6 border border-iq-primary/20">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-iq-primary/20 text-iq-primary border border-iq-primary/20 mb-3 animate-pulse">
                                    <Zap size={12} fill="currentColor" />
                                    ACTIVE MISSION
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{activeStake.bounty.title}</h3>
                                <p className="text-iq-text-secondary text-sm">Target: {currency}{activeStake.bounty.reward.toLocaleString()}</p>
                            </div>
                            <Link
                                to={`/hunter/bounty/${activeStake.bounty.id}`}
                                className="px-6 py-3 bg-iq-primary text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                Continue Mission <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="w-full bg-iq-surface rounded-full h-2 mb-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-iq-primary to-iq-accent"
                                style={{ width: `${Math.max(0, Math.min(100, (new Date(activeStake.bounty.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24) * 10))}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-iq-text-secondary">
                            <span>Progress</span>
                            <span className="text-white font-mono">Deadline: {new Date(activeStake.bounty.submission_deadline).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 rounded-2xl bg-iq-card border border-white/5 text-center">
                    <div className="w-16 h-16 rounded-full bg-iq-surface mx-auto flex items-center justify-center mb-4">
                        <Target size={32} className="text-iq-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
                    <p className="text-iq-text-secondary mb-6 max-w-md mx-auto">
                        Your schedule is clear. Visit the Arena to find high-value bounties and start earning.
                    </p>
                    <Link
                        to="/hunter/arena"
                        className="px-6 py-3 bg-iq-surface border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                    >
                        Browse Arena <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* Hot Bounties Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>🔥</span> Hot Bounties
                    </h2>
                    <Link to="/hunter/arena" className="text-sm text-iq-primary hover:text-iq-accent transition-colors font-medium flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {recentBounties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentBounties.map(bounty => (
                            <div key={bounty.id} className="h-full">
                                <BountyCard bounty={bounty} userRole="hunter" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-iq-text-secondary">No live bounties found. Check back later.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/hunter/arena" className="p-4 rounded-xl bg-iq-card border border-white/5 hover:border-iq-primary/30 hover:bg-iq-surface transition-all group">
                        <Target size={24} className="text-iq-primary mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-white mb-1">Browse Arena</h3>
                        <p className="text-xs text-iq-text-secondary">Find new missions</p>
                    </Link>

                    <Link to="/hunter/vault" className="p-4 rounded-xl bg-iq-card border border-white/5 hover:border-iq-accent/30 hover:bg-iq-surface transition-all group">
                        <TrendingUp size={24} className="text-iq-accent mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-white mb-1">My Vault</h3>
                        <p className="text-xs text-iq-text-secondary">Check earnings</p>
                    </Link>

                    <Link to="/hunter/war-room" className="p-4 rounded-xl bg-iq-card border border-white/5 hover:border-yellow-500/30 hover:bg-iq-surface transition-all group">
                        <div className="relative w-fit mb-3">
                            <Clock size={24} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                            {activeStake && <span className="absolute -top-1 -right-1 w-2 h-2 bg-iq-error rounded-full animate-pulse" />}
                        </div>
                        <h3 className="font-bold text-white mb-1">War Room</h3>
                        <p className="text-xs text-iq-text-secondary">Mission Comms</p>
                    </Link>

                    <Link to="/settings" className="p-4 rounded-xl bg-iq-card border border-white/5 hover:border-white/20 hover:bg-iq-surface transition-all group">
                        <Trophy size={24} className="text-white mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-white mb-1">Leaderboard</h3>
                        <p className="text-xs text-iq-text-secondary">Global ranking</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Helper icon component
function WalletCardIcon({ size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
    )
}

