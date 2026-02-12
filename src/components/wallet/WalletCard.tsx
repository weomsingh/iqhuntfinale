import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface WalletCardProps {
    onDeposit?: () => void;
    onWithdraw?: () => void;
    showDeposit?: boolean;
    showWithdraw?: boolean;
}

const WalletCard = ({ onDeposit, onWithdraw, showDeposit = false, showWithdraw = false }: WalletCardProps) => {
    const { profile } = useAuth();

    // Fallback balance if not set
    const balance = profile?.wallet_balance || 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-iq-secondary to-black border border-iq-border p-8 shadow-2xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-iq-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-iq-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tighter">
                            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <Wallet className="w-8 h-8 text-iq-green" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                    <div className="flex items-center gap-4 text-sm text-iq-text-secondary">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Secure Vault Active</span>
                        </div>
                        <div className="h-4 w-px bg-iq-border" />
                        <span>ID: {profile?.username?.toUpperCase()}</span>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {showDeposit && (
                            <button
                                onClick={onDeposit}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            >
                                <ArrowDownLeft className="w-5 h-5" />
                                Deposit
                            </button>
                        )}
                        {showWithdraw && (
                            <button
                                onClick={onWithdraw}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-iq-secondary hover:bg-white/10 text-white border border-iq-border font-bold rounded-xl transition-colors"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                                Withdraw
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
