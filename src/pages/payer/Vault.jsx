import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import {
    Wallet, ArrowDownCircle, ArrowUpCircle, Clock,
    CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function PayerVault() {
    const { currentUser, refreshUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
                .limit(20);

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeposit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const utrNumber = formData.get('utr_number');
        const paymentMethod = formData.get('payment_method');

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!utrNumber) {
            alert('Please enter UTR number');
            return;
        }

        try {
            const { error } = await supabase
                .from('transactions')
                .insert({
                    user_id: currentUser.id,
                    type: 'deposit',
                    amount: amount,
                    status: 'pending',
                    metadata: {
                        utr_number: utrNumber,
                        payment_method: paymentMethod
                    }
                });

            if (error) throw error;

            alert('✅ Deposit request submitted!\n\nYour funds will be added after admin verification (usually within 24 hours).');
            setShowDepositModal(false);
            await loadTransactions();
        } catch (error) {
            console.error('Deposit error:', error);
            alert('Failed to submit deposit request');
        }
    }

    async function handleWithdraw(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const upiId = formData.get('upi_id');
        const accountHolderName = formData.get('account_holder_name');

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > currentUser.wallet_balance) {
            alert(`Insufficient balance! You have ${currency}${currentUser.wallet_balance.toLocaleString()}`);
            return;
        }

        if (!upiId || !accountHolderName) {
            alert('Please fill all withdrawal details');
            return;
        }

        const confirmed = window.confirm(
            `Withdraw ${currency}${amount.toLocaleString()}?\n\n` +
            `Funds will be sent to: ${upiId}\n` +
            `This will be processed by admin within 24-48 hours.`
        );

        if (!confirmed) return;

        try {
            // Deduct from wallet immediately
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ wallet_balance: currentUser.wallet_balance - amount })
                .eq('id', currentUser.id);

            if (updateError) throw updateError;

            // Create withdrawal transaction
            const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    user_id: currentUser.id,
                    type: 'withdrawal',
                    amount: amount,
                    status: 'pending',
                    metadata: {
                        upi_id: upiId,
                        account_holder_name: accountHolderName
                    }
                });

            if (transactionError) throw transactionError;

            alert('✅ Withdrawal request submitted!\n\nAdmin will process your request within 24-48 hours.');
            setShowWithdrawModal(false);
            await refreshUser();
            await loadTransactions();
        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Failed to submit withdrawal request');
        }
    }

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    const vaultLocked = transactions
        .filter(t => t.type === 'vault_lock' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="vault-page">
            {/* Header */}
            <div className="dashboard-hero">
                <div>
                    <h1>Vault 💰</h1>
                    <p className="hero-subtitle">
                        Manage your funds and transactions
                    </p>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="vault-balance-grid">
                <div className="balance-card main">
                    <Wallet size={32} />
                    <div>
                        <span className="balance-label">Available Balance</span>
                        <span className="balance-amount">
                            {currency}{(currentUser?.wallet_balance || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="balance-card locked">
                    <Clock size={32} />
                    <div>
                        <span className="balance-label">Locked in Bounties</span>
                        <span className="balance-amount">
                            {currency}{vaultLocked.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="vault-actions">
                <button
                    className="btn-primary"
                    onClick={() => setShowDepositModal(true)}
                >
                    <ArrowDownCircle size={20} />
                    Deposit Funds
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => setShowWithdrawModal(true)}
                >
                    <ArrowUpCircle size={20} />
                    Withdraw Funds
                </button>
            </div>

            {/* Transactions */}
            <div className="transactions-section">
                <h2>Recent Transactions</h2>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state-small">
                        <Wallet size={32} />
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="transactions-list">
                        {transactions.map(tx => (
                            <div key={tx.id} className="transaction-item">
                                <div className="tx-icon">
                                    {tx.type === 'deposit' && <ArrowDownCircle size={20} color="#00ff9d" />}
                                    {tx.type === 'withdrawal' && <ArrowUpCircle size={20} color="#ff5252" />}
                                    {tx.type === 'vault_lock' && <Clock size={20} color="#ff9d00" />}
                                    {tx.type === 'vault_unlock' && <CheckCircle size={20} color="#00ff9d" />}
                                </div>

                                <div className="tx-details">
                                    <span className="tx-type">{tx.type.replace('_', ' ')}</span>
                                    <span className="tx-date">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="tx-amount">
                                    <span className={tx.type === 'deposit' || tx.type === 'vault_unlock' ? 'positive' : 'negative'}>
                                        {tx.type === 'deposit' || tx.type === 'vault_unlock' ? '+' : '-'}
                                        {currency}{tx.amount.toLocaleString()}
                                    </span>
                                    <span className={`tx-status ${tx.status}`}>
                                        {tx.status === 'pending' && <Clock size={14} />}
                                        {tx.status === 'completed' && <CheckCircle size={14} />}
                                        {tx.status === 'failed' && <XCircle size={14} />}
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Deposit Funds</h2>
                            <button className="modal-close" onClick={() => setShowDepositModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleDeposit} className="modal-form">
                            <div className="info-box">
                                <AlertCircle size={20} />
                                <div>
                                    <strong>Payment Instructions:</strong>
                                    <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                                        <li>Send money to our UPI ID: <strong>iqhuntarena@upi</strong></li>
                                        <li>Copy the UTR/Reference number from your transaction</li>
                                        <li>Enter the details below</li>
                                        <li>Admin will verify and credit within 24 hours</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Amount ({currency})</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    required
                                    min="1"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>UTR / Reference Number *</label>
                                <input
                                    type="text"
                                    name="utr_number"
                                    placeholder="12-digit UTR number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Payment Method</label>
                                <select name="payment_method" defaultValue="upi">
                                    <option value="upi">UPI</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowDepositModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Withdraw Funds</h2>
                            <button className="modal-close" onClick={() => setShowWithdrawModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleWithdraw} className="modal-form">
                            <div className="info-box">
                                <AlertCircle size={20} />
                                <div>
                                    <strong>Available Balance:</strong> {currency}{currentUser.wallet_balance.toLocaleString()}
                                    <p style={{ margin: '0.5rem 0 0' }}>
                                        Withdrawals are processed within 24-48 hours
                                    </p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Amount ({currency})</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    required
                                    min="1"
                                    max={currentUser.wallet_balance}
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>UPI ID *</label>
                                <input
                                    type="text"
                                    name="upi_id"
                                    placeholder="yourname@upi"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Account Holder Name *</label>
                                <input
                                    type="text"
                                    name="account_holder_name"
                                    placeholder="Full name as per bank account"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowWithdrawModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Request Withdrawal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
