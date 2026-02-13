import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import {
    Target, Clock, Users, TrendingUp, Lock,
    FileText, MessageSquare, Upload, ArrowLeft,
    AlertCircle, CheckCircle
} from 'lucide-react';

export default function BountyDetails() {
    const { id } = useParams();
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [bounty, setBounty] = useState(null);
    const [myStake, setMyStake] = useState(null);
    const [hunterCount, setHunterCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [staking, setStaking] = useState(false);

    useEffect(() => {
        loadBountyData();
    }, [id]);

    async function loadBountyData() {
        try {
            // Get bounty details
            const { data: bountyData, error: bountyError } = await supabase
                .from('bounties')
                .select('*')
                .eq('id', id)
                .single();

            if (bountyError) throw bountyError;
            setBounty(bountyData);

            // Get hunter count
            const { count } = await supabase
                .from('hunter_stakes')
                .select('*', { count: 'exact', head: true })
                .eq('bounty_id', id)
                .eq('status', 'active');

            setHunterCount(count || 0);

            // Check if I'm staked
            const { data: stakeData } = await supabase
                .from('hunter_stakes')
                .select('*')
                .eq('bounty_id', id)
                .eq('hunter_id', currentUser.id)
                .eq('status', 'active')
                .single();

            if (stakeData) setMyStake(stakeData);

        } catch (error) {
            console.error('Error loading bounty:', error);
            alert('Failed to load bounty details');
            navigate('/hunter/arena');
        } finally {
            setLoading(false);
        }
    }

    async function handleStake() {
        if (!currentUser) return;

        // Check if user has enough balance
        if (currentUser.wallet_balance < bounty.entry_fee) {
            alert(`Insufficient balance! You need ${currency}${bounty.entry_fee} to stake.\n\nGo to Vault to deposit funds.`);
            navigate('/hunter/vault');
            return;
        }

        // Confirm stake
        const confirmed = window.confirm(
            `Stake ${currency}${bounty.entry_fee} to enter this hunt?\n\n` +
            `⚠️ Entry fees are NON-REFUNDABLE\n` +
            `⚠️ You can only have ONE active stake at a time\n` +
            `⚠️ You will be locked until mission completion`
        );

        if (!confirmed) return;

        setStaking(true);

        try {
            const { data, error } = await supabase.rpc('lock_target', {
                p_bounty_id: id,
                p_hunter_id: currentUser.id
            });

            if (error) throw error;

            if (data.success) {
                alert('✅ Stake successful! You are now locked in.\n\nAccess the War Room to start hunting.');
                await refreshUser();
                await loadBountyData();
            } else {
                alert(data.error || 'Failed to stake');
            }
        } catch (error) {
            console.error('Stake error:', error);
            alert('Failed to stake. Please try again.');
        } finally {
            setStaking(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading bounty details...</p>
            </div>
        );
    }

    if (!bounty) {
        return (
            <div className="error-state">
                <AlertCircle size={48} />
                <h2>Bounty Not Found</h2>
                <Link to="/hunter/arena" className="btn-secondary">
                    ← Back to Arena
                </Link>
            </div>
        );
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';
    const deadline = new Date(bounty.submission_deadline);
    const isExpired = deadline < new Date();
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    const canStake = bounty.status === 'live' && !isExpired && !myStake;

    return (
        <div className="bounty-details-page">
            {/* Header */}
            <div className="details-header">
                <Link to="/hunter/arena" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Arena
                </Link>
                <div className="status-badges">
                    <span className={`status-badge ${bounty.status}`}>
                        {bounty.status}
                    </span>
                    {isExpired && (
                        <span className="status-badge expired">Expired</span>
                    )}
                    {myStake && (
                        <span className="status-badge staked">
                            <Lock size={14} /> You're Staked
                        </span>
                    )}
                </div>
            </div>

            {/* Title Section */}
            <div className="bounty-title-section">
                <h1>{bounty.title}</h1>
                <p className="bounty-description">{bounty.description}</p>
            </div>

            {/* Key Stats Grid */}
            <div className="bounty-stats-grid">
                <div className="stat-box">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Reward Pool</span>
                        <span className="stat-value highlight">
                            {currency}{bounty.reward.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <Target size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Entry Fee</span>
                        <span className="stat-value">
                            {currency}{bounty.entry_fee.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Hunters Staked</span>
                        <span className="stat-value">{hunterCount}</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Deadline</span>
                        <span className="stat-value">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mission Brief */}
            <div className="mission-section">
                <h2>
                    <FileText size={24} />
                    Mission Brief
                </h2>

                {myStake ? (
                    <div className="mission-access">
                        <CheckCircle size={48} color="#00ff9d" />
                        <h3>Mission Unlocked</h3>
                        <p>You have staked on this bounty. Download the full mission PDF to start hunting.</p>
                        <a
                            href={bounty.mission_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            <FileText size={20} />
                            Download Mission PDF
                        </a>
                    </div>
                ) : (
                    <div className="mission-locked">
                        <Lock size={48} />
                        <h3>Mission Details Locked</h3>
                        <p>Stake your entry fee to unlock the full mission PDF and join the War Room.</p>

                        {canStake ? (
                            <button
                                className="btn-primary btn-stake"
                                onClick={handleStake}
                                disabled={staking}
                            >
                                {staking ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <Lock size={20} />
                                        Stake {currency}{bounty.entry_fee} & Enter Hunt
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="cannot-stake">
                                {bounty.status !== 'live' && (
                                    <p>❌ This bounty is not live</p>
                                )}
                                {isExpired && (
                                    <p>❌ Deadline has passed</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* War Room & Submit Section (Only if staked) */}
            {myStake && (
                <div className="hunter-actions">
                    <div className="action-card">
                        <MessageSquare size={32} />
                        <h3>War Room</h3>
                        <p>Chat with other hunters and strategize</p>
                        <button className="btn-secondary" disabled>
                            <MessageSquare size={18} />
                            Enter War Room (Coming Soon)
                        </button>
                    </div>

                    <div className="action-card">
                        <Upload size={32} />
                        <h3>Submit Work</h3>
                        <p>Upload your completed submission</p>
                        <button className="btn-secondary" disabled>
                            <Upload size={18} />
                            Submit Work (Coming Soon)
                        </button>
                    </div>
                </div>
            )}

            {/* Rules & Info */}
            <div className="bounty-info-section">
                <h3>⚔️ Hunt Rules</h3>
                <ul>
                    <li>Entry fees are <strong>non-refundable</strong></li>
                    <li>Only <strong>one winner</strong> will be selected</li>
                    <li>Winner is chosen by the Payer based on submission quality</li>
                    <li>War Room chats are <strong>ephemeral</strong> (deleted after completion)</li>
                    <li>Deadline: <strong>{deadline.toLocaleString()}</strong></li>
                </ul>
            </div>
        </div>
    );
}
