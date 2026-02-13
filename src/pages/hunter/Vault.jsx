import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import WalletCard from '../../components/WalletCard';
import { Download, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function HunterVault() {
    const { currentUser, refreshUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (currentUser) {
            loadTransactions();
        }
    }, [currentUser]);

    async function loadTransactions() {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleWithdraw() {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!upiId) {
            alert('Please enter your UPI ID');
            return;
        }

        setSubmitting(true);

        try {
            const { data, error } = await supabase.rpc('request_withdrawal', {
                p_user_id: currentUser.id,
                p_amount: parseFloat(withdrawAmount),
                p_upi_id: upiId
            });

            if (error) throw error;

            if (data.success) {
                alert('Withdrawal request submitted! Admin will process it soon.');
                setShowWithdrawModal(false);
                setWithdrawAmount('');
                setUpiId('');
                loadTransactions();
                refreshUser();
            } else {
                alert(data.error || 'Withdrawal failed');
            }
        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Failed to request withdrawal');
        } finally {
            setSubmitting(false);
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'payout': return <Download size={16} className="type-icon payout" />;
            case 'withdrawal': return <Upload size={16} className="type-icon withdrawal" />;
            case 'stake': return <Download size={16} className="type-icon stake" />;
            case 'refund': return <Upload size={16} className="type-icon refund" />;
            default: return <div style={{ width: 16 }} />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="status-icon approved" />;
            case 'pending': return <Clock size={16} className="status-icon pending" />;
            case 'rejected': return <XCircle size={16} className="status-icon rejected" />;
            default: return null;
        }
    };

    return (
        <div className="vault-page">
            <h1>Your Vault</h1>
            <p className="page-subtitle">Track your earnings and manage withdrawals</p>

            <WalletCard
                balance={currentUser?.wallet_balance || 0}
                currency={currentUser?.currency || 'INR'}
                username={currentUser?.username || 'Hunter'}
                onWithdraw={() => setShowWithdrawModal(true)}
            />

            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-label">Total Earnings</span>
                    <span className="stat-value">
                        {currentUser?.currency === 'INR' ? '₹' : '$'}
                        {(currentUser?.total_earnings || 0).toLocaleString()}
                    </span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Hunts Completed</span>
                    <span className="stat-value">{currentUser?.hunts_completed || 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Win Rate</span>
                    <span className="stat-value">
                        {currentUser?.success_rate?.toFixed(1) || 0}%
                    </span>
                </div>
            </div>

            <div className="transactions-section">
                <h2>Transaction History</h2>

                {loading ? (
                    <div className="loading-state">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="transactions-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="type-cell">
                                                {getTypeIcon(tx.type)}
                                                <span className="type-label">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className={`amount ${tx.type === 'payout' || tx.type === 'refund' ? 'positive' : 'negative'}`}>
                                            {tx.type === 'payout' || tx.type === 'refund' ? '+' : '-'}
                                            {tx.currency === 'INR' ? '₹' : '$'}{tx.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="status-cell">
                                                {getStatusIcon(tx.status)}
                                                <span className={`status-label ${tx.status}`}>{tx.status}</span>
                                            </div>
                                        </td>
                                        <td className="reference-cell">
                                            {tx.utr || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Request Withdrawal</h2>
                        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
                            Available: {currentUser?.currency === 'INR' ? '₹' : '$'}
                            {(currentUser?.wallet_balance || 0).toLocaleString()}
                        </p>

                        <div className="form-group">
                            <label>Amount *</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                max={currentUser?.wallet_balance || 0}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>UPI ID *</label>
                            <input
                                type="text"
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleWithdraw}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
