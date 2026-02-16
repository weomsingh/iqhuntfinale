import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import BountyCard from '../../components/BountyCard';
import { Target, Trophy, TrendingUp, Clock, ArrowRight, Zap, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';

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
                .eq('status', 'active');

            // Handle array result safely
            if (stakes && stakes.length > 0) setActiveStake(stakes[0]);

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
            <div className="flex h-screen items-center justify-center">
                <div className="w-10 h-10 border-4 border-iq-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-iq-primary">{currentUser?.username}</span> 👋
                    </h1>
                    <p className="text-iq-text-secondary">
                        Ready to hunt? Here's your mission report.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-iq-card border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Trophy size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-iq-text-secondary">Wins</p>
                            <p className="text-sm font-bold text-white">{currentUser?.hunts_won || 0}</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-iq-card border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-iq-primary/10 flex items-center justify-center text-iq-primary">
                            <Zap size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-iq-text-secondary">Win Rate</p>
                            <p className="text-sm font-bold text-white">{currentUser?.success_rate?.toFixed(0) || 0}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group hover:border-iq-primary/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-white">
                        <Wallet size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">{currency}{(currentUser?.total_earnings || 0).toLocaleString()}</p>
                </div>

                <div className="p-5 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group hover:border-iq-primary/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-iq-primary">
                        <Target size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Active Hunts</p>
                    <p className="text-2xl font-bold text-iq-primary">{activeStake ? 1 : 0}</p>
                </div>

                <div className="p-5 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group hover:border-iq-primary/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-iq-accent">
                        <CheckCircle size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Completed</p>
                    <p className="text-2xl font-bold text-iq-accent">{currentUser?.hunts_completed || 0}</p>
                </div>

                <div className="p-5 rounded-2xl bg-iq-card border border-white/5 relative overflow-hidden group hover:border-iq-primary/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-yellow-500">
                        <Trophy size={48} />
                    </div>
                    <p className="text-sm text-iq-text-secondary mb-1">Rank</p>
                    <p className="text-2xl font-bold text-white">--</p>
                </div>
            </div>

            {/* Active Mission Card */}
            {activeStake ? (
                <div className="rounded-2xl bg-gradient-to-r from-iq-primary/10 to-iq-accent/10 p-[1px]">
                    <div className="rounded-2xl bg-iq-card p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-iq-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-iq-primary/20 text-iq-primary border border-iq-primary/20 mb-4 animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iq-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-iq-primary"></span>
                                    </span>
                                    LIVE MISSION IN PROGRESS
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{activeStake.bounty.title}</h3>
                                <div className="flex items-center gap-4 text-iq-text-secondary text-sm">
                                    <span className="flex items-center gap-1">
                                        <Target size={14} className="text-iq-primary" />
                                        Reward: {currency}{activeStake.bounty.reward.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        Due: {new Date(activeStake.bounty.submission_deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/hunter/bounty/${activeStake.bounty.id}`}
                                className="w-full md:w-auto px-8 py-4 bg-iq-primary text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-iq-primary/20 flex items-center justify-center gap-2"
                            >
                                Continue Mission <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl bg-iq-card border border-dashed border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-iq-surface mx-auto flex items-center justify-center mb-4 border border-white/5">
                            <Target size={32} className="text-iq-text-secondary opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
                        <p className="text-iq-text-secondary mb-8 max-w-md mx-auto">
                            Your schedule is clear. Visit the Arena to find high-value bounties and start earning.
                        </p>
                        <Link
                            to="/hunter/arena"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-iq-surface border border-white/10 hover:bg-white/5 text-white font-medium rounded-xl transition-all"
                        >
                            Browse Arena <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Hot Bounties Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-iq-primary">🔥</span> Hot Bounties
                    </h2>
                    <Link to="/hunter/arena" className="font-medium text-iq-primary hover:text-white transition-colors flex items-center gap-1">
                        View All <ArrowRight size={16} />
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
                        <Target size={32} className="mx-auto text-iq-text-secondary mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-white mb-1">No Active Bounties</h3>
                        <p className="text-iq-text-secondary">Check back later for new missions.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/hunter/arena" className="p-6 rounded-xl bg-iq-card border border-white/5 hover:border-iq-primary/50 hover:bg-iq-surface transition-all group">
                    <Target size={28} className="text-iq-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-1">Browse Arena</h3>
                    <p className="text-xs text-iq-text-secondary">Find new missions</p>
                </Link>

                <Link to="/hunter/vault" className="p-6 rounded-xl bg-iq-card border border-white/5 hover:border-iq-accent/50 hover:bg-iq-surface transition-all group">
                    <TrendingUp size={28} className="text-iq-accent mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-1">My Vault</h3>
                    <p className="text-xs text-iq-text-secondary">Check earnings</p>
                </Link>

                <Link to="/hunter/war-room" className="p-6 rounded-xl bg-iq-card border border-white/5 hover:border-yellow-500/50 hover:bg-iq-surface transition-all group">
                    <Clock size={28} className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-1">War Room</h3>
                    <p className="text-xs text-iq-text-secondary">Mission Comms</p>
                </Link>

                <Link to="/hunter/settings" className="p-6 rounded-xl bg-iq-card border border-white/5 hover:border-white/20 hover:bg-iq-surface transition-all group">
                    <Trophy size={28} className="text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white mb-1">Leaderboard</h3>
                    <p className="text-xs text-iq-text-secondary">Global ranking</p>
                </Link>
            </div>
        </div>
    );
}
