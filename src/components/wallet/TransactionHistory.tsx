import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'earning' | 'stake' | 'refund' | 'bonus';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
}

// Mock Data fallbacks
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'deposit', amount: 50000, status: 'completed', date: 'Today, 10:30 AM', reference: 'UPI/23498...' },
    { id: '2', type: 'stake', amount: 10, status: 'completed', date: 'Yesterday, 4:15 PM', reference: 'Bounty #442' },
    { id: '3', type: 'withdrawal', amount: 25000, status: 'pending', date: '10 Feb, 2:00 PM', reference: 'Bank Transfer' },
];

interface TransactionHistoryProps {
    transactions?: Transaction[];
}

const TransactionHistory = ({ transactions = MOCK_TRANSACTIONS }: TransactionHistoryProps) => {

    const getIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'deposit':
            case 'earning':
            case 'bonus':
            case 'refund':
                return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
            default:
                return <ArrowUpRight className="w-5 h-5 text-red-400" />;
        }
    };

    const getAmountColor = (type: Transaction['type']) => {
        switch (type) {
            case 'deposit':
            case 'earning':
            case 'bonus':
            case 'refund':
                return 'text-green-400';
            default:
                return 'text-white'; // Neutral for spending/withdrawals
        }
    };

    const getStatusBadge = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase border border-green-500/20">Completed</span>;
            case 'pending':
                return <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold uppercase border border-yellow-500/20">Pending</span>;
            case 'failed':
                return <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase border border-red-500/20">Failed</span>;
        }
    };

    return (
        <div className="bg-iq-secondary/30 border border-iq-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-iq-border">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Transaction History
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-iq-text-secondary text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Reference</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-iq-border">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white/5 ${getAmountColor(tx.type)}`}>
                                            {getIcon(tx.type)}
                                        </div>
                                        <span className="font-bold text-white capitalize">{tx.type}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-iq-text-secondary font-mono text-sm">
                                    {tx.reference}
                                </td>
                                <td className="p-4 text-iq-text-secondary text-sm">
                                    {tx.date}
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(tx.status)}
                                </td>
                                <td className={`p-4 text-right font-bold text-lg font-mono ${getAmountColor(tx.type)}`}>
                                    {['deposit', 'earning', 'bonus', 'refund'].includes(tx.type) ? '+' : '-'}
                                    ₹{tx.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {transactions.length === 0 && (
                    <div className="p-8 text-center text-iq-text-secondary font-medium">
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
