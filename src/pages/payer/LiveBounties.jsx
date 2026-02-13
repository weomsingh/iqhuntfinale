import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Target, Users, Clock, TrendingUp, FileText } from 'lucide-react';

export default function PayerLiveBounties() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLiveBounties();
    }, [currentUser]);

    async function loadLiveBounties() {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .select(`
                    *,
                    hunter_count:hunter_stakes(count),
                    submission_count:submissions(count)
                `)
                .eq('payer_id', currentUser.id)
                .eq('status', 'live')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBounties(data || []);
        } catch (error) {
            console.error('Error loading live bounties:', error);
        } finally {
            setLoading(false);
        }
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    return (
        <div className="live-bounties-page">
            <div className="dashboard-hero">
                <div>
                    <h1>Live Bounties 🎯</h1>
                    <p className="hero-subtitle">
                        Your active bounties awaiting completion
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/payer/post-bounty')}
                >
                    <Target size={20} />
                    Post New Bounty
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading live bounties...</p>
                </div>
            ) : bounties.length === 0 ? (
                <div className="empty-state">
                    <Target size={64} />
                    <h3>No Live Bounties</h3>
                    <p>You don't have any active bounties right now</p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/payer/post-bounty')}
                    >
                        Post Your First Bounty
                    </button>
                </div>
            ) : (
                <div className="payer-bounties-list">
                    {bounties.map(bounty => {
                        const deadline = new Date(bounty.submission_deadline);
                        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                        const isExpired = deadline < new Date();

                        return (
                            <div key={bounty.id} className="payer-bounty-card">
                                <div className="bounty-card-header">
                                    <div>
                                        <h3>{bounty.title}</h3>
                                        <p className="bounty-card-description">{bounty.description}</p>
                                    </div>
                                    <div className="status-badges">
                                        <span className="status-badge live">Live</span>
                                        {isExpired && (
                                            <span className="status-badge expired">Deadline Passed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="bounty-card-stats">
                                    <div className="bounty-card-stat">
                                        <span className="stat-label">
                                            <TrendingUp size={16} />
                                            Reward
                                        </span>
                                        <span className="stat-value highlight">
                                            {currency}{bounty.reward.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="bounty-card-stat">
                                        <span className="stat-label">
                                            <Users size={16} />
                                            Hunters
                                        </span>
                                        <span className="stat-value">
                                            {bounty.hunter_count?.[0]?.count || 0}
                                        </span>
                                    </div>

                                    <div className="bounty-card-stat">
                                        <span className="stat-label">
                                            <FileText size={16} />
                                            Submissions
                                        </span>
                                        <span className="stat-value">
                                            {bounty.submission_count?.[0]?.count || 0}
                                        </span>
                                    </div>

                                    <div className="bounty-card-stat">
                                        <span className="stat-label">
                                            <Clock size={16} />
                                            Deadline
                                        </span>
                                        <span className="stat-value">
                                            {isExpired ? 'Expired' : `${daysLeft}d left`}
                                        </span>
                                    </div>
                                </div>

                                <div className="bounty-card-actions">
                                    <button
                                        className="btn-primary btn-sm"
                                        onClick={() => navigate(`/payer/bounty/${bounty.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
