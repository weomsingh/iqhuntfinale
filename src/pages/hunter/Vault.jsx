import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Wallet, TrendingUp, Lock, ArrowUpCircle, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function HunterVault() {
    const { currentUser, refreshUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stakes, setStakes] = useState([]);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    useEffect(() => {
        if (currentUser) {
            loadVaultData();
        }
    }, [currentUser]);

    async function loadVaultData() {
        try {
            // Load transactions
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (txError) throw txError;
            setTransactions(txData || []);

            // Load active stakes
            const { data: stakesData, error: stakesError } = await supabase
                .from('hunter_stakes')
                .select(`
                    *,
                    bounty:bounties(title, reward)
                `)
                .eq('hunter_id', currentUser.id)
                .eq('status', 'active');

            if (stakesError) throw stakesError;
            setStakes(stakesData || []);

        } catch (error) {
            console.error('Error loading vault data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleWithdraw(e) {
        e.preventDefault();

        const amount = parseFloat(withdrawAmount);

        if (amount <= 0 || amount > currentUser.wallet_balance) {
            alert('Invalid withdrawal amount');
            return;
        }

        if (!upiId.trim() || !accountHolder.trim()) {
            alert('Please fill all fields');
            return;
        }

        const confirmed = window.confirm(
            `Withdraw ${currency}${amount.toLocaleString()}?\n\n` +
            `UPI: ${upiId}\n` +
            `Account Holder: ${accountHolder}\n\n` +
            `⚠️ Amount will be deducted immediately\n` +
            `⚠️ Processing takes 24-48 hours`
        );

        if (!confirmed) return;

        setProcessing(true);

        try {
            // Deduct from wallet
            const newBalance = currentUser.wallet_balance - amount;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ wallet_balance: newBalance })
                .eq('id', currentUser.id);

            if (updateError) throw updateError;

            // Create withdrawal transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    user_id: currentUser.id,
                    type: 'withdrawal',
                    amount: amount,
                    currency: currentUser.currency,
                    status: 'pending',
                    metadata: {
                        upi_id: upiId,
                        account_holder: accountHolder
                    }
                });

            if (txError) throw txError;

            alert(`✅ Withdrawal request submitted!\n\n${currency}${amount.toLocaleString()} will be processed within 24-48 hours`);

            await refreshUser();
            await loadVaultData();
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            setUpiId('');
            setAccountHolder('');

        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Failed to process withdrawal. Please try again.');
        } finally {
            setProcessing(false);
        }
    }

    const totalStaked = stakes.reduce((sum, stake) => sum + stake.stake_amount, 0);

    if (loading) {
        return (
            <div className="vault-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vault-page">
            <div className="dashboard-hero">
                <div>
                    <h1>Hunter Vault 💰</h1>
                    <p className="hero-subtitle">
                        Manage your earnings, stakes, and withdrawals
                    </p>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="vault-balance-grid">
                <div className="balance-card main">
                    <Wallet size={48} />
                    <div>
                        <span className="balance-label">Available Balance</span>
                        <span className="balance-amount">
                            {currency}{currentUser.wallet_balance.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="balance-card locked">
                    <Lock size={48} />
                    <div>
                        <span className="balance-label">Staked in Bounties</span>
                        <span className="balance-amount">
                            {currency}{totalStaked.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="balance-card" style={{ borderColor: 'rgba(0, 204, 255, 0.3)', background: 'rgba(0, 204, 255, 0.05)' }}>
                    <TrendingUp size={48} style={{ color: '#00ccff' }} />
                    <div>
                        <span className="balance-label">Total Earnings</span>
                        <span className="balance-amount">
                            {currency}{(currentUser.wallet_balance + totalStaked).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="vault-actions">
                <button
                    className="btn-primary"
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={currentUser.wallet_balance <= 0}
                >
                    <ArrowUpCircle size={20} />
                    Withdraw Funds
                </button>
            </div>

            {/* Active Stakes */}
            {stakes.length > 0 && (
                <div className="transactions-section">
                    <h2>Active Stakes</h2>
                    <div className="transactions-list">
                        {stakes.map(stake => (
                            <div key={stake.id} className="transaction-item">
                                <div className="tx-icon" style={{ background: 'rgba(255, 157, 0, 0.1)' }}>
                                    <Lock size={20} style={{ color: '#ff9d00' }} />
                                </div>
                                <div className="tx-details">
                                    <div className="tx-type">{stake.bounty.title}</div>
                                    <div className="tx-date">
                                        Staked on {new Date(stake.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="tx-amount">
                                    <span className="negative">
                                        -{currency}{stake.stake_amount.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                        Potential: {currency}{stake.bounty.reward.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transaction History */}
            <div className="transactions-section">
                <h2>Transaction History</h2>
                {transactions.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem 2rem' }}>
                        <DollarSign size={48} />
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="transactions-list">
                        {transactions.map(tx => {
                            const isPositive = tx.type === 'win_prize' || tx.type === 'refund_stake';
                            const Icon = tx.type === 'withdrawal' ? ArrowUpCircle :
                                tx.type === 'stake' ? Lock :
                                    tx.type === 'win_prize' ? TrendingUp :
                                        tx.type === 'refund_stake' ? TrendingUp : DollarSign;

                            return (
                                <div key={tx.id} className="transaction-item">
                                    <div className="tx-icon">
                                        <Icon size={20} />
                                    </div>
                                    <div className="tx-details">
                                        <div className="tx-type">
                                            {tx.type === 'win_prize' ? 'Prize Won' :
                                                tx.type === 'refund_stake' ? 'Stake Refunded' :
                                                    tx.type === 'stake' ? 'Bounty Stake' :
                                                        tx.type === 'withdrawal' ? 'Withdrawal' : tx.type}
                                        </div>
                                        <div className="tx-date">
                                            {new Date(tx.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="tx-amount">
                                        <span className={isPositive ? 'positive' : 'negative'}>
                                            {isPositive ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                                        </span>
                                        <span className={`tx-status ${tx.status}`}>
                                            {tx.status === 'pending' && <Clock size={12} />}
                                            {tx.status === 'completed' && <CheckCircle size={12} />}
                                            {tx.status === 'failed' && <XCircle size={12} />}
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => !processing && setShowWithdrawModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Withdraw Funds</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={processing}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleWithdraw} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="withdraw-amount">
                                    <DollarSign size={18} />
                                    Amount ({currency})
                                </label>
                                <input
                                    type="number"
                                    id="withdraw-amount"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    max={currentUser.wallet_balance}
                                    step="0.01"
                                    required
                                    disabled={processing}
                                />
                                <small>
                                    Available: {currency}{currentUser.wallet_balance.toLocaleString()}
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="upi-id">UPI ID / Bank Account</label>
                                <input
                                    type="text"
                                    id="upi-id"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@upi or Account Number"
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="account-holder">Account Holder Name</label>
                                <input
                                    type="text"
                                    id="account-holder"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="Full Name as per bank records"
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="modal-info">
                                <p>⚠️ Withdrawal will be processed within 24-48 hours</p>
                                <p>⚠️ Amount will be deducted from your wallet immediately</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowWithdrawModal(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : `Withdraw ${currency}${withdrawAmount || '0'}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
