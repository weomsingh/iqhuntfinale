import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Wallet, Zap, History as HistoryIcon, MessageSquare } from 'lucide-react';
import '../styles/BottomNav.css';

export default function BottomNav({ role }) {
    const location = useLocation();

    const hunterLinks = [
        { path: '/hunter/dashboard', label: 'Home', icon: Home },
        { path: '/hunter/arena', label: 'Arena', icon: Target },
        { path: '/hunter/war-room', label: 'War Room', icon: MessageSquare },
        { path: '/hunter/vault', label: 'Vault', icon: Wallet },
    ];

    const payerLinks = [
        { path: '/payer/dashboard', label: 'Home', icon: Home },
        { path: '/payer/live-bounties', label: 'Live', icon: Zap },
        { path: '/payer/war-room', label: 'War Room', icon: MessageSquare },
        { path: '/payer/vault', label: 'Vault', icon: Wallet },
    ];

    const links = role === 'hunter' ? hunterLinks : payerLinks;

    return (
        <nav className="bottom-nav">
            {links.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`bottom-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <div className="icon-container">
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="nav-label">{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
