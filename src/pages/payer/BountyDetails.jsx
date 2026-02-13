import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import {
    ArrowLeft, Users, FileText, Clock, TrendingUp,
    Trophy, CheckCircle, AlertCircle, Target
} from 'lucide-react';

export default function PayerBountyDetails() {
    const { id } = useParams();
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [bounty, setBounty] = useState(null);
    const [hunters, setHunters] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);

    useEffect(() => {
        loadBountyData();
    }, [id]);

    async function loadBountyData() {
        try {
            // Get bounty
            const { data: bountyData, error: bountyError } = await supabase
                .from('bounties')
                .select('*')
                .eq('id', id)
                .eq('payer_id', currentUser.id) // Ensure ownership
                .single();

            if (bountyError) throw bountyError;
            setBounty(bountyData);

            // Get hunters
            const { data: huntersData } = await supabase
                .from('hunter_stakes')
                .select(`
                    *,
                    hunter:profiles(id, username, expertise_tags)
                `)
                .eq('bounty_id', id)
                .eq('status', 'active');

            setHunters(huntersData || []);

            // Get submissions
            const { data: submissionsData } = await supabase
                .from('submissions')
                .select(`
                    *,
                    hunter:profiles(username)
                `)
                .eq('bounty_id', id)
                .order('ai_score', { ascending: false });

            setSubmissions(submissionsData || []);

        } catch (error) {
            console.error('Error loading bounty:', error);
            alert('Failed to load bounty details');
            navigate('/payer/dashboard');
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectWinner(submissionId, hunterId) {
        const submission = submissions.find(s => s.id === submissionId);

        const confirmed = window.confirm(
            `Select ${submission.hunter.username} as the winner?\n\n` +
            `⚠️ This action is IRREVERSIBLE\n` +
            `⚠️ ${currency}${bounty.reward.toLocaleString()} will be paid to the winner\n` +
            `⚠️ All other hunters will lose their stakes`
        );

        if (!confirmed) return;

        setSelecting(true);

        try {
            const { data, error } = await supabase.rpc('select_winner', {
                p_bounty_id: id,
                p_winner_id: hunterId
            });

            if (error) throw error;

            if (data.success) {
                alert(`✅ Winner selected!\n\n${submission.hunter.username} has been awarded ${currency}${bounty.reward.toLocaleString()}`);
                await refreshUser();
                await loadBountyData();
            } else {
                alert(data.error || 'Failed to select winner');
            }
        } catch (error) {
            console.error('Select winner error:', error);
            alert('Failed to select winner. Please try again.');
        } finally {
            setSelecting(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading bounty...</p>
            </div>
        );
    }

    if (!bounty) {
        return (
            <div className="error-state">
                <AlertCircle size={48} />
                <h2>Bounty Not Found</h2>
                <Link to="/payer/dashboard" className="btn-secondary">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';
    const deadline = new Date(bounty.submission_deadline);
    const isExpired = deadline < new Date();
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    const canSelectWinner = bounty.status === 'live' && submissions.length > 0;

    return (
        <div className="payer-bounty-details-page">
            {/* Header */}
            <div className="details-header">
                <Link to="/payer/dashboard" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <div className="status-badges">
                    <span className={`status-badge ${bounty.status}`}>
                        {bounty.status}
                    </span>
                    {isExpired && bounty.status === 'live' && (
                        <span className="status-badge expired">Deadline Passed</span>
                    )}
                </div>
            </div>

            {/* Title */}
            <div className="bounty-title-section">
                <h1>{bounty.title}</h1>
                <p className="bounty-description">{bounty.description}</p>
            </div>

            {/* Stats */}
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
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Hunters Staked</span>
                        <span className="stat-value">{hunters.length}</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Submissions</span>
                        <span className="stat-value">{submissions.length}</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Deadline</span>
                        <span className="stat-value">
                            {isExpired ? 'Expired' : `${daysLeft}d left`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mission PDF */}
            <div className="mission-pdf-section">
                <h2>
                    <FileText size={24} />
                    Mission Brief
                </h2>
                <a
                    href={bounty.mission_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    <FileText size={18} />
                    View Mission PDF
                </a>
            </div>

            {/* Staked Hunters */}
            <div className="hunters-section">
                <h2>
                    <Users size={24} />
                    Staked Hunters ({hunters.length})
                </h2>

                {hunters.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No hunters have staked yet</p>
                    </div>
                ) : (
                    <div className="hunters-grid">
                        {hunters.map(stake => (
                            <div key={stake.id} className="hunter-card">
                                <div className="hunter-info">
                                    <span className="hunter-name">{stake.hunter.username}</span>
                                    <div className="hunter-tags">
                                        {stake.hunter.expertise_tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="tag-small">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="stake-amount">
                                    Staked: {currency}{stake.entry_fee}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submissions */}
            <div className="submissions-section">
                <h2>
                    <FileText size={24} />
                    Submissions ({submissions.length})
                </h2>

                {submissions.length === 0 ? (
                    <div className="empty-state-small">
                        <AlertCircle size={32} />
                        <p>No submissions yet</p>
                        <small>Submissions will appear here as hunters complete their work</small>
                    </div>
                ) : (
                    <div className="submissions-list">
                        {submissions.map(submission => (
                            <div key={submission.id} className="submission-card">
                                <div className="submission-header">
                                    <div className="submission-info">
                                        <h3>{submission.hunter.username}</h3>
                                        <span className="submission-date">
                                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {submission.ai_score && (
                                        <div className="ai-score">
                                            <span className="score-label">AI Score</span>
                                            <span className="score-value">{submission.ai_score}/100</span>
                                        </div>
                                    )}
                                </div>

                                <div className="submission-content">
                                    <h4>Submission Notes</h4>
                                    <p>{submission.submission_text || 'No notes provided'}</p>
                                </div>

                                <div className="submission-actions">
                                    {submission.submission_file_url && (
                                        <a
                                            href={submission.submission_file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary"
                                        >
                                            <FileText size={18} />
                                            View Submission File
                                        </a>
                                    )}

                                    {canSelectWinner && bounty.winner_id === null && (
                                        <button
                                            className="btn-primary btn-select-winner"
                                            onClick={() => handleSelectWinner(submission.id, submission.hunter_id)}
                                            disabled={selecting}
                                        >
                                            {selecting ? (
                                                'Selecting...'
                                            ) : (
                                                <>
                                                    <Trophy size={18} />
                                                    Select as Winner
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {bounty.winner_id === submission.hunter_id && (
                                        <div className="winner-badge">
                                            <CheckCircle size={18} />
                                            WINNER
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Banner */}
            {bounty.status === 'live' && submissions.length > 0 && (
                <div className="info-banner">
                    <AlertCircle size={20} />
                    <div>
                        <strong>Ready to select a winner?</strong>
                        <p>Review all submissions carefully. Once you select a winner, the action cannot be undone.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
