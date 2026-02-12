import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, Briefcase, Clock, ChevronRight, AlertCircle } from 'lucide-react';

// Mock Data
const MY_BOUNTIES = [
    {
        id: 1,
        title: 'Fintech Dashboard UI Design',
        reward: 15000,
        deadline: '2 days left',
        applicants: 12,
        submissions: 5,
        status: 'Active',
        category: 'Design'
    },
    {
        id: 2,
        title: 'React Component Library',
        reward: 8000,
        deadline: 'Expired',
        applicants: 24,
        submissions: 18,
        status: 'Reviewing',
        category: 'Development'
    },
    {
        id: 3,
        title: 'SEO Content Strategy',
        reward: 5000,
        deadline: '7 days left',
        applicants: 4,
        submissions: 0,
        status: 'Active',
        category: 'Content'
    },
];

const MyBountiesPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Your Bounties</h1>
                    <p className="text-iq-text-secondary">Track progress, review submissions, and manage payouts.</p>
                </div>
                <Link
                    to="/payer/post-bounty"
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    <PlusCircle className="w-5 h-5" />
                    Post New Bounty
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-iq-secondary/30 rounded-xl border border-iq-border overflow-x-auto">
                <div className="relative flex-grow min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-iq-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search your bounties..."
                        className="w-full bg-iq-black border border-iq-border rounded-lg pl-9 pr-4 py-2 text-white focus:border-blue-500 outline-none text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-iq-black border border-iq-border rounded-lg text-sm font-medium text-iq-text-secondary hover:text-white transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Bounties List */}
            <div className="space-y-4">
                {MY_BOUNTIES.map((bounty) => (
                    <div key={bounty.id} className="bg-iq-secondary/30 border border-iq-border rounded-xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">

                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${bounty.status === 'Active' ? 'bg-green-500' :
                            bounty.status === 'Reviewing' ? 'bg-yellow-500' : 'bg-iq-border'
                            }`} />

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pl-4">

                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/5 text-iq-text-secondary border border-white/10">
                                        {bounty.category}
                                    </span>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${bounty.status === 'Active' ? 'text-green-400' :
                                        bounty.status === 'Reviewing' ? 'text-yellow-400' : 'text-iq-text-secondary'
                                        }`}>
                                        {bounty.status === 'Reviewing' && <AlertCircle className="w-3 h-3" />}
                                        {bounty.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                                    {bounty.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-iq-text-secondary">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                        ₹{bounty.reward.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        {bounty.deadline}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{bounty.applicants}</p>
                                    <p className="text-xs text-iq-text-secondary uppercase tracking-wider">Hunters</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <p className="text-2xl font-bold text-white">{bounty.submissions}</p>
                                        {bounty.submissions > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mb-4"></span>}
                                    </div>
                                    <p className="text-xs text-iq-text-secondary uppercase tracking-wider">Submissions</p>
                                </div>

                                <Link
                                    to={`/payer/bounty/${bounty.id}`}
                                    className="ml-auto md:ml-0 p-3 bg-white/5 rounded-full hover:bg-white/10 text-iq-text-secondary hover:text-white transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBountiesPage;
