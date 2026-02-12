import { Link } from 'react-router-dom';
import { ShieldCheck, Users, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Pending Deposits', value: '₹1,50,000', count: 3, icon: ArrowDownLeft, color: 'text-green-500' },
        { label: 'Pending Payouts', value: '₹45,000', count: 5, icon: ArrowUpRight, color: 'text-red-500' },
        { label: 'Total Users', value: '1,240', count: 12, icon: Users, color: 'text-blue-500' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Command Center</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-red-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                                {stat.count} Requests
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-zinc-500 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link to="/admin/verify" className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Verify Transactions</h3>
                            <p className="text-sm text-zinc-500">Approve manual deposits & withdrawals</p>
                        </div>
                    </div>
                </Link>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-zinc-800 rounded-full text-zinc-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Dispute Resolution</h3>
                            <p className="text-sm text-zinc-500">Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
