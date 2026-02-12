import { Link } from 'react-router-dom';
import { PlusCircle, Wallet, Briefcase, Users, ArrowUpRight, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PayerDashboard = () => {
    const { profile } = useAuth();

    const stats = [
        { label: 'Active Bounties', value: '3', icon: Briefcase, color: 'text-iq-green' },
        { label: 'Total Spent', value: '₹45,000', icon: Wallet, color: 'text-emerald-400' },
        { label: 'Hunters Hired', value: '12', icon: Users, color: 'text-green-400' },
    ];

    const activeBounties = [
        { id: 1, title: 'Fintech Dashboard UI', budget: '₹15,000', deadline: '2 days left', applicants: 5, status: 'Active' },
        { id: 2, title: 'React Component Library', budget: '₹8,000', deadline: '5 hours left', applicants: 11, status: 'Urgent' },
        { id: 3, title: 'SEO Content Strategy', budget: '₹5,000', deadline: '7 days left', applicants: 2, status: 'Active' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.username || 'Payer'}</h1>
                    <p className="text-iq-text-secondary">Manage your bounties and track your investments.</p>
                </div>
                <Link
                    to="/payer/post-bounty"
                    className="flex items-center gap-2 bg-iq-green hover:bg-emerald-500 text-iq-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] transform hover:-translate-y-1"
                >
                    <PlusCircle className="w-5 h-5" />
                    Post New Bounty
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-iq-secondary/30 border border-iq-border p-6 rounded-xl hover:border-iq-green/30 transition-all hover:shadow-[0_0_15px_rgba(0,255,157,0.05)] group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-white/5 ${stat.color} group-hover:bg-iq-green/10 transition-colors`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-iq-green uppercase tracking-wider bg-iq-green/10 px-2 py-1 rounded">
                                +12% this week
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-iq-text-secondary text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Active Bounties Table */}
            <div className="bg-iq-secondary/30 border border-iq-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-iq-border flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-iq-green" />
                        Active Bounties
                    </h2>
                    <Link to="/payer/bounties" className="text-sm text-iq-green hover:text-emerald-400 flex items-center gap-1 font-medium hover:underline">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-iq-text-secondary text-xs uppercase tracking-wider border-b border-iq-border">
                                <th className="p-4 font-medium">Bounty Title</th>
                                <th className="p-4 font-medium">Budget</th>
                                <th className="p-4 font-medium">Deadline</th>
                                <th className="p-4 font-medium">Applicants</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-iq-border">
                            {activeBounties.map((bounty) => (
                                <tr key={bounty.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-bold text-white max-w-xs truncate">{bounty.title}</td>
                                    <td className="p-4 text-iq-text-secondary font-mono">{bounty.budget}</td>
                                    <td className="p-4 text-iq-text-secondary flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {bounty.deadline}
                                    </td>
                                    <td className="p-4 text-iq-text-secondary">
                                        <div className="flex -space-x-2">
                                            {[...Array(Math.min(bounty.applicants, 3))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-iq-secondary border border-iq-black flex items-center justify-center text-xs font-bold text-white ring-2 ring-iq-black">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                            {bounty.applicants > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-iq-secondary border border-iq-black flex items-center justify-center text-xs font-bold text-iq-text-secondary ring-2 ring-iq-black">
                                                    +{bounty.applicants - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bounty.status === 'Urgent' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                            }`}>
                                            {bounty.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-sm font-bold text-iq-text-secondary hover:text-white transition-colors">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayerDashboard;
