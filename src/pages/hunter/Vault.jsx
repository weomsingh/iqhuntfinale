import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import WalletCard from '../../components/WalletCard';
import { Download, Upload, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';

const ADMIN_UPI = "iqhunt@paytm"; // Replace with actual UPI
const ADMIN_QR = "/qr-code.png"; // Replace with actual QR code image

export default function HunterVault() {
    const { currentUser, refreshUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [depositUTR, setDepositUTR] = useState('');
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
            setTransactions(data || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeposit() {
        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!depositUTR || depositUTR.length < 8) {
            alert('Please enter a valid UTR number (min 8 characters)');
            return;
        }

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('transactions')
                .insert({
                    user_id: currentUser.id,
                    type: 'deposit',
                    amount: parseFloat(depositAmount),
                    currency: currentUser.currency,
                    utr: depositUTR,
                    status: 'pending'
                });

            if (error) throw error;

            alert('✅ Deposit request submitted! Admin will verify and credit your wallet within 24 hours.');
            setShowDepositModal(false);
            setDepositAmount('');
            setDepositUTR('');
            loadTransactions();
        } catch (error) {
            console.error('Deposit error:', error);
            alert('Failed to submit deposit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleWithdraw() {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (parseFloat(withdrawAmount) > currentUser.wallet_balance) {
            alert('Insufficient balance');
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
                alert('✅ Withdrawal request submitted! Admin will process it within 48 hours.');
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
            alert('Failed to request withdrawal. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'payout': return <Download size={16} className="type-icon payout" />;
            case 'withdrawal': return <Upload size={16} className="type-icon withdrawal" />;
            case 'stake': return <Download size={16} className="type-icon stake" />;
            case 'refund': return <Upload size={16} className="type-icon refund" />;
            case 'deposit': return <Download size={16} className="type-icon deposit" />;
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
            <p className="page-subtitle">Track your earnings and manage your funds</p>

            <WalletCard
                balance={currentUser?.wallet_balance || 0}
                currency={currentUser?.currency || 'INR'}
                username={currentUser?.username || 'Hunter'}
                onDeposit={() => setShowDepositModal(true)}
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
                        <p>No transactions yet. Deposit funds or complete hunts to see activity here.</p>
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
                                        <td className={`amount ${['payout', 'refund', 'deposit'].includes(tx.type) && tx.status === 'approved' ? 'positive' : 'negative'}`}>
                                            {['payout', 'refund', 'deposit'].includes(tx.type) && tx.status === 'approved' ? '+' : '-'}
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

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>💰 Deposit Funds</h2>
                        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
                            Follow these steps to add money to your wallet
                        </p>

                        <div className="deposit-instructions">
                            <div className="instruction-step">
                                <span className="step-number">1</span>
                                <div>
                                    <h4>Pay via UPI</h4>
                                    <p>Use any UPI app to pay to:</p>
                                    <div className="upi-info">
                                        <code>{ADMIN_UPI}</code>
                                        <button onClick={() => copyToClipboard(ADMIN_UPI)} className="btn-copy">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="instruction-step">
                                <span className="step-number">2</span>
                                <div>
                                    <h4>Enter Details</h4>
                                    <div className="form-group">
                                        <label>Amount (₹) *</label>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            min="1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>UTR/Transaction ID *</label>
                                        <input
                                            type="text"
                                            placeholder="12 digit UTR number"
                                            value={depositUTR}
                                            onChange={(e) => setDepositUTR(e.target.value)}
                                            minLength="8"
                                        />
                                        <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>
                                            Found in your payment app's transaction details
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="instruction-step">
                                <span className="step-number">3</span>
                                <div>
                                    <h4>Wait for Verification</h4>
                                    <p>Admin will verify and credit within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowDepositModal(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleDeposit}
                                disabled={submitting || !depositAmount || !depositUTR}
                            >
                                {submitting ? 'Submitting...' : 'Submit for Verification'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>💸 Request Withdrawal</h2>
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
                            <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>
                                Admin will send money to this UPI ID within 48 hours
                            </small>
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
                                disabled={submitting || !withdrawAmount || !upiId}
                            >
                                {submitting ? 'Submitting...' : 'Request Withdrawal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
