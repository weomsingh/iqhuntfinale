import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import WalletCard from '../../components/WalletCard';
import { Target, Trophy, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';

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
                .limit(3);

            setRecentBounties(bounties || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    return (
        <div className="dashboard-page">
            {/* Welcome Section */}
            <div className="dashboard-hero">
                <div>
                    <h1>Welcome back, {currentUser?.username}! 🎯</h1>
                    <p className="hero-subtitle">
                        {activeStake ? (
                            <>You have an active hunt. Time to deliver! 💪</>
                        ) : (
                            <>Ready to hunt? Browse the arena for new bounties.</>
                        )}
                    </p>
                </div>
                <Link to="/hunter/arena" className="btn-primary">
                    <Target size={20} />
                    Browse Arena
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Wallet Balance</span>
                        <span className="stat-value highlight">
                            {currency}{(currentUser?.wallet_balance || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Trophy size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Earnings</span>
                        <span className="stat-value">
                            {currency}{(currentUser?.total_earnings || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Target size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Hunts Won</span>
                        <span className="stat-value">
                            {currentUser?.hunts_won || 0} / {currentUser?.hunts_completed || 0}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Zap size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Win Rate</span>
                        <span className="stat-value">
                            {currentUser?.success_rate?.toFixed(1) || 0}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Active Hunt Section */}
            {activeStake ? (
                <div className="active-hunt-section">
                    <h2>🔥 Your Active Hunt</h2>
                    <div className="active-hunt-card">
                        <div className="hunt-header">
                            <div>
                                <h3>{activeStake.bounty.title}</h3>
                                <p className="hunt-reward">
                                    Reward: <span className="highlight">
                                        {currency}{activeStake.bounty.reward.toLocaleString()}
                                    </span>
                                </p>
                            </div>
                            <Link to={`/hunter/bounty/${activeStake.bounty.id}`} className="btn-primary">
                                View Details <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="hunt-stats">
                            <div className="hunt-stat">
                                <Clock size={16} />
                                <span>Deadline: {new Date(activeStake.bounty.submission_deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="hunt-stat">
                                <Target size={16} />
                                <span>Your Stake: {currency}{activeStake.entry_fee}</span>
                            </div>
                        </div>

                        <div className="deadline-bar">
                            <div className="deadline-label">Time Remaining</div>
                            <div className="deadline-progress">
                                <div
                                    className="deadline-fill"
                                    style={{ width: `${Math.max(0, Math.min(100, (new Date(activeStake.bounty.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24) * 10))}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-active-hunt">
                    <div className="empty-state-icon">🎯</div>
                    <h3>No Active Hunt</h3>
                    <p>Browse the arena to find your next challenge!</p>
                    <Link to="/hunter/arena" className="btn-secondary">
                        Explore Bounties
                    </Link>
                </div>
            )}

            {/* Recent Opportunities */}
            <div className="recent-section">
                <div className="section-header">
                    <h2>🔥 Hot Bounties</h2>
                    <Link to="/hunter/arena" className="view-all-link">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">Loading bounties...</div>
                ) : recentBounties.length === 0 ? (
                    <div className="empty-state">
                        <p>No active bounties at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <div className="bounties-list">
                        {recentBounties.map(bounty => (
                            <div key={bounty.id} className="bounty-item">
                                <div className="bounty-item-content">
                                    <h4>{bounty.title}</h4>
                                    <p>{bounty.description.substring(0, 80)}...</p>
                                    <div className="bounty-item-meta">
                                        <span className="reward-badge">
                                            {currency}{bounty.reward.toLocaleString()}
                                        </span>
                                        <span className="deadline-badge">
                                            <Clock size={14} />
                                            {new Date(bounty.submission_deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={`/hunter/bounty/${bounty.id}`}
                                    className="btn-bounty-view"
                                    disabled={activeStake !== null}
                                >
                                    View →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/hunter/arena" className="action-card">
                        <Target size={32} />
                        <h3>Browse Arena</h3>
                        <p>Find new bounties to compete in</p>
                    </Link>

                    <Link to="/hunter/vault" className="action-card">
                        <TrendingUp size={32} />
                        <h3>Manage Vault</h3>
                        <p>Deposit, withdraw, and track earnings</p>
                    </Link>

                    {activeStake && (
                        <Link to={`/hunter/bounty/${activeStake.bounty.id}`} className="action-card highlight">
                            <Zap size={32} />
                            <h3>Active Hunt</h3>
                            <p>Continue your current mission</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
