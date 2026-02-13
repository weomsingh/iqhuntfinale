import { Target, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BountyCard({ bounty, userRole = 'hunter', onAction }) {
    const { id, title, description, reward, currency, max_hunters, submission_deadline, status, entry_fee } = bounty;

    const symbol = currency === 'INR' ? '₹' : '$';
    const deadline = new Date(submission_deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
    const isExpired = daysLeft <= 0;

    // Count staked hunters (mock for now - will come from database)
    const stakedHunters = bounty.staked_count || 0;
    const slotsLeft = max_hunters - stakedHunters;

    return (
        <div className={`bounty-card ${status}`}>
            <div className="bounty-header">
                <div className="bounty-status-badge">
                    {status === 'live' && '🟢 Live'}
                    {status === 'pending_approval' && '🟡 Pending'}
                    {status === 'in_progress' && '🔵 In Progress'}
                    {status === 'completed' && '✅ Completed'}
                </div>
                {isExpiringSoon && !isExpired && (
                    <div className="expiry-badge">⚠️ {daysLeft}d left</div>
                )}
                {isExpired && (
                    <div className="expiry-badge expired">⏰ Expired</div>
                )}
            </div>

            <h3 className="bounty-title">{title}</h3>
            <p className="bounty-description">{description.substring(0, 120)}...</p>

            <div className="bounty-stats">
                <div className="stat">
                    <TrendingUp size={16} />
                    <span className="stat-label">Reward</span>
                    <span className="stat-value reward">{symbol}{reward.toLocaleString()}</span>
                </div>

                {userRole === 'hunter' && entry_fee > 0 && (
                    <div className="stat">
                        <Target size={16} />
                        <span className="stat-label">Entry Fee</span>
                        <span className="stat-value">{symbol}{entry_fee}</span>
                    </div>
                )}

                <div className="stat">
                    <Users size={16} />
                    <span className="stat-label">Hunters</span>
                    <span className="stat-value">{stakedHunters}/{max_hunters}</span>
                    {slotsLeft > 0 && status === 'live' && (
                        <span className="slots-badge">{slotsLeft} slots left</span>
                    )}
                </div>

                <div className="stat">
                    <Calendar size={16} />
                    <span className="stat-label">Deadline</span>
                    <span className="stat-value">{deadline.toLocaleDateString()}</span>
                </div>
            </div>

            <div className="bounty-actions">
                {userRole === 'hunter' && status === 'live' && !isExpired && (
                    <Link to={`/hunter/bounty/${id}`} className="btn-bounty-action">
                        View Details →
                    </Link>
                )}
                {userRole === 'payer' && (
                    <Link to={`/payer/bounty/${id}`} className="btn-bounty-action">
                        Manage →
                    </Link>
                )}
            </div>
        </div>
    );
}
