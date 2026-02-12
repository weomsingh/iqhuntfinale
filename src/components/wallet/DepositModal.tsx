import { useState } from 'react';
import { X, Copy, CheckCircle, Shield, Loader2 } from 'lucide-react';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [utr, setUtr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(3);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-iq-secondary border border-iq-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">

                <div className="flex items-center justify-between p-6 border-b border-iq-border">
                    <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
                        <X className="w-5 h-5 text-iq-text-secondary" />
                    </button>
                </div>

                {step === 1 && (
                    <div className="p-6 space-y-6">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                            <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                            <p className="text-sm text-blue-200/80">
                                Funds are held in a secure escrow until released. Deposits are verified manually within 2 hours.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-white">Bank Details for Transfer</h3>

                            <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-iq-border">
                                <div className="flex justify-between items-center">
                                    <span className="text-iq-text-secondary text-sm">Account Name</span>
                                    <span className="font-bold text-white">IQHUNT Technologies</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-iq-text-secondary text-sm">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-white">998877665544</span>
                                        <button onClick={() => handleCopy('998877665544')}><Copy className="w-3 h-3 text-iq-text-secondary hover:text-white" /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-iq-text-secondary text-sm">IFSC Code</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-white">HDFC0001234</span>
                                        <button onClick={() => handleCopy('HDFC0001234')}><Copy className="w-3 h-3 text-iq-text-secondary hover:text-white" /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-iq-text-secondary text-sm">UPI ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-white">singhomedu69-1@oksbi</span>
                                        <button onClick={() => handleCopy('singhomedu69-1@oksbi')}><Copy className="w-3 h-3 text-iq-text-secondary hover:text-white" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                        >
                            I Have Made the Payment
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-iq-text-secondary mb-2">Amount Transferred (INR)</label>
                                <input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none font-mono text-lg"
                                    placeholder="5000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-iq-text-secondary mb-2">UTR / Reference Number</label>
                                <input
                                    type="text"
                                    required
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none font-mono"
                                    placeholder="Enter 12-digit UTR"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 bg-iq-secondary hover:bg-white/5 border border-iq-border text-white font-bold rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Verification'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Deposit Request Received</h3>
                        <p className="text-iq-text-secondary">
                            Your deposit of <strong className="text-white">₹{Number(amount).toLocaleString()}</strong> is under review.
                            Funds will reflect in your wallet once the UTR is verified (approx 2 hours).
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

export default DepositModal;
