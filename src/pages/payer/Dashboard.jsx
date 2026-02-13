import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Target, Plus, TrendingUp, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function PayerDashboard() {
    const { currentUser } = useAuth();
    const [bounties, setBounties] = useState([]);
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        totalSpent: 0,
        vaultLocked: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadDashboardData();
        }
    }, [currentUser]);

    async function loadDashboardData() {
        try {
            // Get all bounties
            const { data: bountiesData, error } = await supabase
                .from('bounties')
                .select('*')
                .eq('payer_id', currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setBounties(bountiesData || []);

            // Calculate stats
            const activeBounties = bountiesData?.filter(b => b.status === 'live') || [];
            const completedBounties = bountiesData?.filter(b => b.status === 'completed') || [];
            const totalVaultLocked = activeBounties.reduce((sum, b) => sum + (b.vault_locked || 0), 0);
            const totalSpent = completedBounties.reduce((sum, b) => sum + b.reward, 0);

            setStats({
                active: activeBounties.length,
                completed: completedBounties.length,
                totalSpent,
                vaultLocked: totalVaultLocked
            });

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
                    <h1>Payer Dashboard 💰</h1>
                    <p className="hero-subtitle">
                        Manage your bounties and track hunter performance
                    </p>
                </div>
                <Link to="/payer/post-bounty" className="btn-primary">
                    <Plus size={20} />
                    Post New Bounty
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Target size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Active Bounties</span>
                        <span className="stat-value highlight">{stats.active}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{stats.completed}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Vault Locked</span>
                        <span className="stat-value">
                            {currency}{stats.vaultLocked.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value">
                            {currency}{stats.totalSpent.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bounties List */}
            <div className="bounties-section">
                <h2>Your Bounties</h2>

                {loading ? (
                    <div className="loading-state">Loading bounties...</div>
                ) : bounties.length === 0 ? (
                    <div className="empty-state">
                        <Target size={64} color="#666666" />
                        <h3>No Bounties Yet</h3>
                        <p>Post your first bounty to get started</p>
                        <Link to="/payer/post-bounty" className="btn-primary">
                            <Plus size={20} />
                            Post Bounty
                        </Link>
                    </div>
                ) : (
                    <div className="payer-bounties-list">
                        {bounties.map(bounty => (
                            <BountyCard key={bounty.id} bounty={bounty} currency={currency} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function BountyCard({ bounty, currency }) {
    const deadline = new Date(bounty.submission_deadline);
    const isExpired = deadline < new Date();
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

    const [hunterCount, setHunterCount] = useState(0);
    const [submissionCount, setSubmissionCount] = useState(0);

    useEffect(() => {
        loadBountyCounts();
    }, [bounty.id]);

    async function loadBountyCounts() {
        // Get hunter count
        const { count: hunters } = await supabase
            .from('hunter_stakes')
            .select('*', { count: 'exact', head: true })
            .eq('bounty_id', bounty.id)
            .eq('status', 'active');

        // Get submission count
        const { count: submissions } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('bounty_id', bounty.id);

        setHunterCount(hunters || 0);
        setSubmissionCount(submissions || 0);
    }

    return (
        <div className="payer-bounty-card">
            <div className="bounty-card-header">
                <div>
                    <h3>{bounty.title}</h3>
                    <p className="bounty-card-description">{bounty.description}</p>
                </div>
                <span className={`status-badge ${bounty.status}`}>
                    {bounty.status}
                </span>
            </div>

            <div className="bounty-card-stats">
                <div className="bounty-card-stat">
                    <span className="stat-label">Reward</span>
                    <span className="stat-value highlight">
                        {currency}{bounty.reward.toLocaleString()}
                    </span>
                </div>

                <div className="bounty-card-stat">
                    <span className="stat-label">
                        <Users size={14} />
                        Hunters
                    </span>
                    <span className="stat-value">{hunterCount}</span>
                </div>

                <div className="bounty-card-stat">
                    <span className="stat-label">
                        <CheckCircle size={14} />
                        Submissions
                    </span>
                    <span className="stat-value">{submissionCount}</span>
                </div>

                <div className="bounty-card-stat">
                    <span className="stat-label">
                        <Clock size={14} />
                        Deadline
                    </span>
                    <span className="stat-value">
                        {isExpired ? 'Expired' : `${daysLeft}d left`}
                    </span>
                </div>
            </div>

            <div className="bounty-card-actions">
                <Link
                    to={`/payer/bounty/${bounty.id}`}
                    className="btn-secondary btn-sm"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}
