import { X, Target, Clock, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Bounty {
    id: string;
    title: string;
    description?: string;
    requirements?: string[];
    reward: number;
    currency: string;
    deadline: string;
    slots: number;
    filled: number;
    category: string;
}

interface BountyDetailsModalProps {
    bounty: Bounty;
    onClose: () => void;
    onStake: () => void;
}

const BountyDetailsModal = ({ bounty, onClose, onStake }: BountyDetailsModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-iq-secondary border border-iq-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="sticky top-0 bg-iq-secondary/95 border-b border-iq-border p-6 flex items-start justify-between z-10 backdrop-blur-md">
                    <div>
                        <span className="px-2 py-1 bg-iq-green/10 text-iq-green text-xs font-bold rounded uppercase tracking-wider mb-2 inline-block">
                            {bounty.category}
                        </span>
                        <h2 className="text-2xl font-bold text-white leading-tight">{bounty.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-iq-text-secondary" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs text-iq-text-secondary mb-1">Reward Pool</p>
                            <p className="text-lg font-bold text-iq-green">₹{bounty.reward.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs text-iq-text-secondary mb-1">Time Left</p>
                            <div className="flex items-center gap-1 font-bold text-white">
                                <Clock className="w-4 h-4 text-blue-400" />
                                {bounty.deadline}
                            </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs text-iq-text-secondary mb-1">Slots</p>
                            <div className="flex items-center gap-1 font-bold text-white">
                                <Users className="w-4 h-4 text-purple-400" />
                                {bounty.filled}/{bounty.slots}
                            </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs text-iq-text-secondary mb-1">Entry Stake</p>
                            <div className="flex items-center gap-1 font-bold text-yellow-400">
                                <ShieldCheck className="w-4 h-4" />
                                ₹10
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Mission Brief</h3>
                        <p className="text-iq-text-secondary leading-relaxed">
                            {bounty.description || "This mission requires high-level execution. Review the requirements carefully before staking your reputation and funds."}
                        </p>
                    </div>

                    {/* Requirements */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Requirements</h3>
                        <ul className="space-y-2">
                            {(bounty.requirements || [
                                "Deliver high-fidelity Figma files",
                                "Include a fully interactive prototype",
                                "Adhere to the specified color system",
                                "Submit before the deadline"
                            ]).map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-iq-text-secondary">
                                    <Target className="w-5 h-5 text-iq-green shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Staking Notice */}
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200/80">
                            <strong className="text-yellow-500 block mb-1">Staking Required</strong>
                            To discourage spam, a <strong>₹10 deposit</strong> is required to join. This will be refunded upon valid submission, regardless of whether you win.
                        </div>
                    </div>

                </div>

                {/* Footer / Action */}
                <div className="sticky bottom-0 bg-iq-secondary border-t border-iq-border p-6 backdrop-blur-md">
                    <button
                        onClick={onStake}
                        className="w-full py-4 bg-iq-green text-iq-black font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(0,255,157,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group"
                    >
                        <ShieldCheck className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Stake ₹10 to Join Hunt
                    </button>
                    <p className="text-center text-xs text-iq-text-secondary mt-3">
                        By staking, you agree to the <span className="text-iq-green cursor-pointer underline">Hunters Covenant</span>.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default BountyDetailsModal;
