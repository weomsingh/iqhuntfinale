import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { History as HistoryIcon, CheckCircle, Trophy, TrendingUp, Calendar } from 'lucide-react';

export default function PayerHistory() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [completedBounties, setCompletedBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCompleted: 0,
        totalSpent: 0,
        winnersSelected: 0
    });

    useEffect(() => {
        loadHistory();
    }, [currentUser]);

    async function loadHistory() {
        try {
            // Get completed bounties
            const { data: bountiesData, error } = await supabase
                .from('bounties')
                .select(`
                    *,
                    winner:profiles!bounties_winner_id_fkey(username),
                    hunter_count:hunter_stakes(count)
                `)
                .eq('payer_id', currentUser.id)
                .eq('status', 'completed')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setCompletedBounties(bountiesData || []);

            // Calculate stats
            const totalCompleted = bountiesData?.length || 0;
            const totalSpent = bountiesData?.reduce((sum, b) => sum + b.reward, 0) || 0;
            const winnersSelected = bountiesData?.filter(b => b.winner_id).length || 0;

            setStats({ totalCompleted, totalSpent, winnersSelected });
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    return (
        <div className="history-page">
            <div className="dashboard-hero">
                <div>
                    <h1>History 📜</h1>
                    <p className="hero-subtitle">
                        Your completed bounties and past missions
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Completed Bounties</span>
                        <span className="stat-value">{stats.totalCompleted}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Trophy size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Winners Selected</span>
                        <span className="stat-value">{stats.winnersSelected}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value highlight">
                            {currency}{stats.totalSpent.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Completed Bounties */}
            <div className="history-section">
                <h2>
                    <HistoryIcon size={24} />
                    Completed Bounties
                </h2>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading history...</p>
                    </div>
                ) : completedBounties.length === 0 ? (
                    <div className="empty-state-small">
                        <HistoryIcon size={32} />
                        <p>No completed bounties yet</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {completedBounties.map(bounty => (
                            <div key={bounty.id} className="history-card">
                                <div className="history-card-header">
                                    <div>
                                        <h3>{bounty.title}</h3>
                                        <p className="history-card-description">{bounty.description}</p>
                                    </div>
                                    <span className="status-badge completed">
                                        <CheckCircle size={14} />
                                        Completed
                                    </span>
                                </div>

                                <div className="history-card-details">
                                    <div className="history-detail">
                                        <span className="detail-label">
                                            <TrendingUp size={16} />
                                            Reward Paid
                                        </span>
                                        <span className="detail-value">
                                            {currency}{bounty.reward.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="history-detail">
                                        <span className="detail-label">
                                            <Trophy size={16} />
                                            Winner
                                        </span>
                                        <span className="detail-value">
                                            {bounty.winner?.username || 'No winner selected'}
                                        </span>
                                    </div>

                                    <div className="history-detail">
                                        <span className="detail-label">
                                            <CheckCircle size={16} />
                                            Hunters Participated
                                        </span>
                                        <span className="detail-value">
                                            {bounty.hunter_count?.[0]?.count || 0}
                                        </span>
                                    </div>

                                    <div className="history-detail">
                                        <span className="detail-label">
                                            <Calendar size={16} />
                                            Completed On
                                        </span>
                                        <span className="detail-value">
                                            {new Date(bounty.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="history-card-actions">
                                    <button
                                        className="btn-secondary btn-sm"
                                        onClick={() => navigate(`/payer/bounty/${bounty.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
