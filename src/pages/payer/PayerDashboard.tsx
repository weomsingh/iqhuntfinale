
import { Link } from 'react-router-dom';
import {
    PlusCircle,
    Wallet,
    Users,
    ArrowRight,
    Zap,
    TrendingUp,
    CheckCircle,
    ArrowUpRight,
    MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PayerDashboard = () => {
    const { profile } = useAuth();
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const stats = [
        {
            label: 'Wallet Balance',
            value: `₹${profile?.wallet_balance?.toLocaleString('en-IN') || '45,230.00'} `,
            subtext: '↑ ₹5,000 this week',
            subtextColor: 'text-iq-green',
            icon: Wallet,
            cta: 'Lock Capital →',
            ctaLink: '/payer/vault'
        },
        {
            label: 'Active Bounties',
            value: '7',
            subtext: '3 awaiting submissions',
            subtextColor: 'text-[#888]',
            icon: Zap,
            cta: 'View All →',
            ctaLink: '/payer/live-bounties'
        },
        {
            label: 'Total Spent',
            value: '₹2,34,500',
            subtext: 'All-time',
            subtextColor: 'text-[#888]',
            icon: TrendingUp,
            cta: 'View History →',
            ctaLink: '/payer/history'
        },
        {
            label: 'Completion Rate',
            value: '94%',
            subtext: '32/34 bounties completed',
            subtextColor: 'text-iq-green',
            icon: CheckCircle,
            cta: 'View Stats →',
            ctaLink: '/payer/analytics'
        },
    ];

    const activeBounties = [
        {
            id: 1,
            title: 'Design Modern Landing Page for SaaS Startup',
            reward: '₹25,000',
            status: 'ACTIVE',
            joined: 8,
            totalSlots: 12,
            submissions: 3,
            deadline: '2 days left',
            urgent: false
        },
        {
            id: 2,
            title: 'React Native App Performance Optimization',
            reward: '₹50,000',
            status: 'IN REVIEW',
            joined: 12,
            totalSlots: 12,
            submissions: 8,
            deadline: '12 hrs ago',
            urgent: true
        }
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Good morning, <span className="text-iq-green">{profile?.username || 'Hunter'}</span> 👋
                </h1>
                <p className="text-iq-text-secondary font-medium">{currentDate}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="group bg-[#ffffff05] border border-iq-green/20 rounded-2xl p-6 backdrop-blur-xl hover:-translate-y-1 hover:border-iq-green/50 hover:shadow-[0_12px_32px_rgba(0,255,157,0.1)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-iq-green/10 flex items-center justify-center text-iq-green mb-4 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-[#888]">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white mt-2 mb-1">{stat.value}</h3>
                        <p className={`text-xs font-bold ${stat.subtextColor} flex items-center gap-1`}>
                            {stat.subtext}
                        </p>
                        <Link to={stat.ctaLink} className="inline-block mt-4 text-sm font-bold text-iq-green hover:underline">
                            {stat.cta}
                        </Link>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/payer/post-bounty" className="group h-[140px] bg-[#ffffff05] border border-[#ffffff1a] rounded-xl p-6 hover:bg-iq-green/5 hover:border-iq-green transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <PlusCircle className="w-5 h-5 text-iq-green" />
                                    <h3 className="text-lg font-bold text-white">Post Bounty</h3>
                                </div>
                                <p className="text-sm text-[#888]">Launch a new mission instantly</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#444] group-hover:text-iq-green group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link to="/payer/vault" className="group h-[140px] bg-[#ffffff05] border border-[#ffffff1a] rounded-xl p-6 hover:bg-iq-green/5 hover:border-iq-green transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet className="w-5 h-5 text-iq-green" />
                                    <h3 className="text-lg font-bold text-white">Lock Capital</h3>
                                </div>
                                <p className="text-sm text-[#888]">Add funds to your wallet</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#444] group-hover:text-iq-green group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link to="/payer/analytics" className="group h-[140px] bg-[#ffffff05] border border-[#ffffff1a] rounded-xl p-6 hover:bg-iq-green/5 hover:border-iq-green transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-5 h-5 text-iq-green" />
                                    <h3 className="text-lg font-bold text-white">View Report</h3>
                                </div>
                                <p className="text-sm text-[#888]">Download activity summary</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#444] group-hover:text-iq-green group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Active Bounties Feed */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Active Bounties (2)</h2>
                    <Link to="/payer/live-bounties" className="text-iq-green font-bold hover:underline flex items-center gap-1">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {activeBounties.map((bounty) => (
                        <div key={bounty.id} className="bg-[#ffffff05] border border-[#ffffff1a] rounded-2xl p-6 hover:border-iq-green/50 transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${bounty.status === 'ACTIVE' ? 'bg-iq-green/20 text-iq-green' : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {bounty.status}
                                    </span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-iq-green transition-colors">{bounty.title}</h3>
                                </div>
                                <div className="text-2xl font-black text-iq-green font-mono">{bounty.reward}</div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[#ffffff05] rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-white mb-1">{bounty.joined}/{bounty.totalSlots}</div>
                                    <div className="text-xs text-[#666] uppercase">Joined</div>
                                </div>
                                <div className="bg-[#ffffff05] rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-white mb-1">{bounty.submissions}</div>
                                    <div className="text-xs text-[#666] uppercase">Submissions</div>
                                </div>
                                <div className="bg-[#ffffff05] rounded-lg p-3 text-center">
                                    <div className="text-lg font-bold text-white mb-1">{bounty.deadline}</div>
                                    <div className="text-xs text-[#666] uppercase">Time Left</div>
                                </div>
                                <div className="bg-[#ffffff05] rounded-lg p-3 text-center flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="text-lg font-bold text-white mb-1">23</div>
                                        <div className="text-xs text-[#666] uppercase">Messages</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button className="py-3 rounded-lg bg-[#ffffff05] border border-[#ffffff1a] text-white font-bold hover:bg-white/10 transition-all">
                                    View Participants
                                </button>
                                <button className="py-3 rounded-lg border border-iq-green text-iq-green font-bold hover:bg-iq-green/10 transition-all relative">
                                    Review Submissions
                                    {bounty.submissions > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </button>
                                <button className="py-3 rounded-lg bg-[#ffffff05] border border-[#ffffff1a] text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> War Room
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-0 pl-2">
                    {[
                        { text: 'Hunter @pixelninja joined "Design Modern Landing Page"', time: '2 hours ago' },
                        { text: 'New submission received on "React Native App"', time: '5 hours ago' },
                        { text: 'Bounty "SEO Content Strategy" funded successfully', time: 'Yesterday at 3:45 PM' },
                        { text: '@shadowcoder won "React Development"', time: '2 days ago' }
                    ].map((item, i) => (
                        <div key={i} className="relative pl-8 pb-8 last:pb-0 border-l border-iq-green/20">
                            <span className="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-[#0a0a0a] border-2 border-iq-green" />
                            <p className="text-white mb-1 hover:text-iq-green transition-colors cursor-pointer">{item.text}</p>
                            <p className="text-xs text-[#666]">{item.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PayerDashboard;
