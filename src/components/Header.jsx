import { useAuth } from '../context/AuthContext';
import { Bell, Wallet, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    const currency = currentUser.currency === 'INR' ? '₹' : '$';

    return (
        <div className="sticky top-0 z-30 w-full h-16 bg-iq-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button - Placeholder as Sidebar logic needs to handle toggle, but visual is here */}
                <button className="md:hidden text-iq-text-secondary hover:text-white">
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-display font-bold tracking-tight text-white hidden sm:block">IQHUNT</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-iq-surface border border-white/10 text-iq-text-secondary uppercase">
                        {currentUser.role === 'hunter' ? 'High Council' : 'Benefactor'}
                    </span>
                </div>
            </div>

            {/* Central Search - Desktop Only */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-iq-text-secondary" size={16} />
                    <input
                        type="text"
                        placeholder="Search bounties..."
                        className="w-full bg-iq-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-iq-primary/50 transition-colors placeholder:text-gray-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Wallet Balance */}
                <Link
                    to={`/${currentUser.role}/vault`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-iq-success/10 border border-iq-success/20 rounded-lg text-iq-success hover:bg-iq-success/20 transition-colors"
                >
                    <Wallet size={16} />
                    <span className="font-mono font-bold text-sm">
                        {currency}{(currentUser.wallet_balance || 0).toLocaleString()}
                    </span>
                </Link>

                {/* Notifications */}
                <button className="relative p-2 text-iq-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-iq-error rounded-full pointer-events-none animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-iq-primary to-iq-accent p-[1px]">
                        <div className="w-full h-full rounded-full bg-iq-background flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-white hidden md:block max-w-[100px] truncate">
                        {currentUser.username}
                    </span>
                </div>
            </div>
        </div>
    );
}

