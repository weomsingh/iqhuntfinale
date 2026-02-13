
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Target, LayoutDashboard, Search, Wallet, BarChart2, LogOut, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const HunterLayout = () => {
    const { profile, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
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

    return (
        <div className="min-h-screen bg-iq-black flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden h-16 border-b border-iq-border bg-iq-black flex items-center justify-between px-4 sticky top-0 z-40">
                <Link to="/hunter/dashboard" className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-iq-green" />
                    <span className="font-display font-bold text-xl tracking-tight text-white">IQHUNT</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 bottom-0 left-0 z-50 w-64 bg-iq-secondary/95 md:bg-iq-secondary/30 backdrop-blur-xl md:backdrop-blur-none border-r border-iq-border p-6 flex flex-col transition-transform duration-300 ease-in-out h-[100dvh] md:h-screen
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="hidden md:flex items-center gap-2 mb-10 group">
                    <Target className="w-8 h-8 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT</span>
                </div>

                <nav className="space-y-2 flex-grow mt-4 md:mt-0">
                    <Link
                        to="/hunter/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/hunter/dashboard')
                            ? 'bg-iq-green/10 text-iq-green border border-iq-green/20'
                            : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/hunter/arena"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/hunter/arena')
                            ? 'bg-iq-green/10 text-iq-green border border-iq-green/20'
                            : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Arena</span>
                    </Link>

                    <Link
                        to="/hunter/vault"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/hunter/vault')
                            ? 'bg-iq-green/10 text-iq-green border border-iq-green/20'
                            : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">Vault</span>
                    </Link>

                    <Link
                        to="/hunter/stats"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/hunter/stats')
                            ? 'bg-iq-green/10 text-iq-green border border-iq-green/20'
                            : 'text-iq-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">My Stats</span>
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
            <main className="flex-1 md:ml-0 min-h-screen flex flex-col w-full overflow-x-hidden">
                {/* Desktop Header */}
                <header className="hidden md:flex h-20 border-b border-iq-border bg-iq-black/50 backdrop-blur-sm sticky top-0 z-30 px-8 items-center justify-end gap-6">
                    <div className="flex items-center gap-2 bg-iq-green/10 px-4 py-2 rounded-full border border-iq-green/20">
                        <Wallet className="w-4 h-4 text-iq-green" />
                        <span className="font-mono font-bold text-iq-green">₹{profile?.wallet_balance?.toLocaleString('en-IN') || '0.00'}</span>
                    </div>

                    <button className="relative text-iq-text-secondary hover:text-white transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-iq-secondary border border-iq-border flex items-center justify-center text-iq-green font-bold text-xl">
                            {profile?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-bold text-white">{profile?.username}</p>
                            <p className="text-xs text-iq-text-secondary capitalize">{profile?.role}</p>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default HunterLayout;
