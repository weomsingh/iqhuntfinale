import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Target, Wallet, LogOut, Zap, History as HistoryIcon, Shield, MessageSquare } from 'lucide-react';

export default function Sidebar({ role }) {
    const location = useLocation();
    const { signOut } = useAuth();

    const hunterLinks = [
        { path: '/hunter/dashboard', label: 'Dashboard', icon: Home },
        { path: '/hunter/arena', label: 'Arena', icon: Target },
        { path: '/hunter/war-room', label: 'War Room', icon: MessageSquare },
        { path: '/hunter/vault', label: 'Vault', icon: Wallet },
    ];

    const payerLinks = [
        { path: '/payer/dashboard', label: 'Dashboard', icon: Home },
        { path: '/payer/live-bounties', label: 'Live Bounties', icon: Zap },
        { path: '/payer/war-room', label: 'War Room', icon: MessageSquare },
        { path: '/payer/history', label: 'History', icon: HistoryIcon },
        { path: '/payer/vault', label: 'Vault', icon: Wallet },
    ];

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Shield },
    ];

    const links = role === 'hunter' ? hunterLinks : role === 'payer' ? payerLinks : adminLinks;

    return (
        <aside className="sidebar">
            {links.map(link => {
                const Icon = link.icon;
                return (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <Icon size={20} />
                        <span>{link.label}</span>
                    </Link>
                );
            })}

            <div className="sidebar-spacer"></div>

            <button className="sidebar-link sign-out" onClick={signOut}>
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>
        </aside>
    );
}
