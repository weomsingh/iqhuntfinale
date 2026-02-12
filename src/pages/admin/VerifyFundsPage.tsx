import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, X, Copy, Loader2 } from 'lucide-react';

const MOCK_REQUESTS = [
    { id: 1, type: 'deposit', user: 'fintech_giant', amount: 50000, utr: 'AX1234567890', time: '10 mins ago', status: 'pending' },
    { id: 2, type: 'withdrawal', user: 'design_ninja', amount: 15000, details: 'upi: design@okicici', time: '1 hour ago', status: 'pending' },
    { id: 3, type: 'deposit', user: 'startup_inc', amount: 100000, utr: 'HDFC99887766', time: '2 hours ago', status: 'pending' },
];

const VerifyFundsPage = () => {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        setProcessingId(id);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRequests(prev => prev.filter(req => req.id !== id));
        setProcessingId(null);
        alert(`Transaction ${action}d successfully`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">Verify Funds</h1>
            <p className="text-zinc-500 mb-8">Manually verify UTRs for deposits and process payouts for withdrawals.</p>

            <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                        <tr>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Details (UTR / UPI)</th>
                            <th className="p-4 font-medium">Time</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {req.type === 'deposit' ? (
                                            <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                                <ArrowDownLeft className="w-3 h-3" /> Deposit
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                                <ArrowUpRight className="w-3 h-3" /> Withdrawal
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-white">{req.user}</td>
                                <td className="p-4 font-mono text-white text-lg">₹{req.amount.toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <code className="bg-black px-2 py-1 rounded text-zinc-300 text-sm border border-zinc-800">
                                            {req.type === 'deposit' ? req.utr : req.details}
                                        </code>
                                        <button className="text-zinc-500 hover:text-white transition-colors">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 text-zinc-500 text-sm">{req.time}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'approve')}
                                            disabled={processingId === req.id}
                                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors border border-green-500/20"
                                            title="Approve"
                                        >
                                            {processingId === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'reject')}
                                            disabled={processingId === req.id}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                            title="Reject"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {requests.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">
                        <Check className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>All clean! No pending transactions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyFundsPage;
