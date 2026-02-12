import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
    const { profile } = useAuth();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'upi' | 'bank'>('upi');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSuccess(true);
    };

    const maxAmount = profile?.wallet_balance || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-iq-secondary border border-iq-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">

                <div className="flex items-center justify-between p-6 border-b border-iq-border">
                    <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
                        <X className="w-5 h-5 text-iq-text-secondary" />
                    </button>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                            <p className="text-sm text-yellow-200/80">
                                Withdrawals are processed within 24 hours. Ensure your UPI ID / Bank details are correct.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-iq-text-secondary">Amount (INR)</label>
                                    <span className="text-xs text-iq-text-secondary">Max: ₹{maxAmount}</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    max={maxAmount}
                                    min={100}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none font-mono text-lg"
                                    placeholder="Min ₹100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-iq-text-secondary mb-2">Payout Method</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMethod('upi')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'upi' ? 'bg-blue-600 text-white' : 'bg-iq-black border border-iq-border text-iq-text-secondary hover:text-white'}`}
                                    >
                                        UPI
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMethod('bank')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${method === 'bank' ? 'bg-blue-600 text-white' : 'bg-iq-black border border-iq-border text-iq-text-secondary hover:text-white'}`}
                                    >
                                        Bank Transfer
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-iq-text-secondary mb-2">
                                    {method === 'upi' ? 'UPI ID' : 'Account Details (IFSC & Acc No.)'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    placeholder={method === 'upi' ? 'username@upi' : 'Account No / IFSC'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || Number(amount) > maxAmount || Number(amount) < 100}
                            className="w-full py-3 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Payout'}
                        </button>
                    </form>
                ) : (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Withdrawal Requested</h3>
                        <p className="text-iq-text-secondary">
                            Your request for <strong className="text-white">₹{Number(amount).toLocaleString()}</strong> has been submitted.
                            It will be processed within 24 hours.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-iq-secondary hover:bg-white/5 border border-iq-border text-white font-bold rounded-lg transition-colors mt-4"
                        >
                            Close
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default WithdrawalModal;
