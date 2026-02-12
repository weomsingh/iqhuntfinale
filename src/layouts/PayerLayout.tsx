import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Target, LayoutDashboard, PlusCircle, Briefcase, Wallet, Settings, LogOut, Bell } from 'lucide-react';

const PayerLayout = () => {
    const { profile, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-iq-black flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-iq-secondary/30 border-r border-iq-border p-6 flex flex-col z-20">
                <Link to="/" className="flex items-center gap-2 mb-10 group">
                    <Target className="w-8 h-8 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT</span>
                </Link>

                <nav className="space-y-2 flex-grow">
                    <Link
                        to="/payer/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payer/dashboard')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/payer/post-bounty"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payer/post-bounty')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="font-medium">Post Bounty</span>
                    </Link>

                    <Link
                        to="/payer/bounties"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payer/bounties')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Your Bounties</span>
                    </Link>

                    <Link
                        to="/payer/wallet"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payer/wallet')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">Wallet</span>
                    </Link>

                    <Link
                        to="/payer/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payer/settings')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="pt-6 border-t border-iq-border space-y-2">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-20 border-b border-iq-border bg-iq-black/50 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-end gap-6">
                    <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                        <Wallet className="w-4 h-4 text-blue-400" />
                        <span className="font-mono font-bold text-blue-400">₹{profile?.wallet_balance?.toLocaleString('en-IN') || '0.00'}</span>
                    </div>

                    <button className="relative text-iq-text-secondary hover:text-white transition-colors">
                        <Bell className="w-6 h-6" />
                        {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-iq-secondary border border-iq-border flex items-center justify-center text-blue-400 font-bold text-xl">
                            {profile?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-white">{profile?.username}</p>
                            <p className="text-xs text-iq-text-secondary capitalize">{profile?.role}</p>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PayerLayout;
