import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Target,
    LayoutDashboard,
    Zap,
    PlusCircle,
    FileText,
    Shield,
    BarChart2,
    Settings,
    HelpCircle,
    LogOut,
    Search,
    Bell,
    ChevronDown,
    Wallet,
    Menu,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const PayerLayout = () => {
    const { profile, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    const isActive = (path: string) => location.pathname === path;

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 group relative ${isActive(to)
                ? 'bg-iq-green/10 text-iq-green'
                : 'text-[#888] hover:bg-white/5 hover:text-white'
                }`}
        >
            {isActive(to) && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-iq-green rounded-r-full" />
            )}
            <Icon className={`w-5 h-5 ${isActive(to) ? 'text-iq-green' : 'group-hover:text-white'} transition-colors`} strokeWidth={2} />
            <span className={`font-medium ${isActive(to) ? 'font-semibold' : ''}`}>{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row font-sans text-iq-text selection:bg-iq-green selection:text-iq-black">

            {/* Mobile Header */}
            <header className="lg:hidden h-16 border-b border-iq-border bg-[#0a0a0a] flex items-center justify-between px-4 sticky top-0 z-40">
                <Link to="/payer/dashboard" className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-iq-green" />
                    <span className="font-display font-bold text-xl tracking-tight text-white">IQHUNT</span>
                </Link>
                <div className="flex items-center gap-4">
                    {/* Mobile Wallet Display */}
                    <div className="flex items-center gap-1 bg-iq-green/10 px-2 py-1 rounded text-xs border border-iq-green/10">
                        <Wallet className="w-3 h-3 text-iq-green" />
                        <span className="font-bold text-iq-green">₹{profile?.wallet_balance?.toLocaleString('en-IN') || '0'}</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Sidebar - Fixed Left on Desktop, Slide-in on Mobile */}
            <aside className={`
                fixed lg:sticky top-0 bottom-0 left-0 z-50 w-[240px] bg-[#0f0f0f]/95 lg:bg-[#0f0f0f]/80 backdrop-blur-md border-r border-[#ffffff0d] flex flex-col pt-6 transition-transform duration-300 ease-in-out h-[100dvh] lg:h-screen
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Section (Desktop Only) */}
                <div className="hidden lg:flex items-center px-6 mb-8 shrink-0 h-14">
                    <Link to="/payer/dashboard" className="flex items-center gap-3 group">
                        <Target className="w-6 h-6 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-iq-green transition-colors">IQHUNT</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1">
                    <NavItem to="/payer/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/payer/live-bounties" icon={Zap} label="Live Bounties" />
                    <NavItem to="/payer/post-bounty" icon={CirclePlus} label="Post Bounty" />
                    <NavItem to="/payer/history" icon={FileText} label="History" />
                    <NavItem to="/payer/vault" icon={Shield} label="Vault" />

                    <div className="my-6 mx-6 h-px bg-[#ffffff0d]" />

                    <div className="px-6 mb-2">
                        <span className="text-xs font-bold text-[#444] uppercase tracking-wider">Support</span>
                    </div>
                    <NavItem to="/payer/analytics" icon={ChartColumn} label="Analytics" />
                    <NavItem to="/payer/settings" icon={Settings} label="Settings" />
                    <NavItem to="/payer/help" icon={CircleHelp} label="Help" />
                </nav>

                <div className="p-6">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 lg:ml-0 min-h-screen flex flex-col w-full overflow-x-hidden relative">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-iq-green/15 sticky top-0 z-30 px-8 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#666]" />
                        <input
                            type="text"
                            placeholder="Search bounties, hunters..."
                            className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-[#666] focus:outline-none focus:border-iq-green/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all"
                        />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-6">
                        {/* Quick Actions */}
                        <div className="flex items-center gap-3 mr-4">
                            <Link
                                to="/payer/post-bounty"
                                className="flex items-center gap-2 bg-iq-green text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all"
                            >
                                <CirclePlus className="w-4 h-4" />
                                Post Bounty
                            </Link>
                            <Link
                                to="/payer/vault"
                                className="flex items-center gap-2 bg-transparent border border-iq-green/30 text-iq-green px-6 py-3 rounded-lg font-semibold text-sm hover:bg-iq-green/10 transition-all"
                            >
                                <Wallet className="w-4 h-4" />
                                Lock Capital
                            </Link>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-[#888] hover:text-white transition-colors group">
                            <Bell className="w-5 h-5 group-hover:text-iq-green transition-colors" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]" />
                        </button>

                        {/* Wallet Balance */}
                        <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-iq-green" />
                            <span className="font-bold text-lg text-white">₹{profile?.wallet_balance?.toLocaleString('en-IN') || '0.00'}</span>
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 pl-4 border-l border-[#ffffff1a] hover:bg-white/5 py-2 px-3 rounded-r-lg transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-iq-secondary border border-iq-border flex items-center justify-center text-iq-green font-bold shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                    {profile?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden xl:block text-left">
                                    <p className="text-sm font-bold text-white leading-none mb-1">@{profile?.username}</p>
                                    <ChevronDown className="w-3 h-3 text-[#666] mx-auto" />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f0f0f] border border-[#ffffff1a] rounded-xl shadow-2xl py-2 z-50">
                                    <Link to="/payer/settings" className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-white/5 transition-colors">Settings</Link>
                                    <div className="h-px bg-[#ffffff1a] my-2" />
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="px-4 py-6 lg:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PayerLayout;
