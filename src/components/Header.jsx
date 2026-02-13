import { useAuth } from '../context/AuthContext';
import { Bell, Wallet, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    const currency = currentUser.currency === 'INR' ? '₹' : '$';

    return (
        <div className="header">
            <div className="header-left">
                <h2 className="header-title">IQHUNT</h2>
                <span className="header-role-badge">
                    {currentUser.role === 'hunter' ? '🎯 Hunter' : '💰 Payer'}
                </span>
            </div>

            <div className="header-right">
                {/* Wallet Balance */}
                <Link to={`/${currentUser.role}/vault`} className="header-wallet">
                    <Wallet size={18} />
                    <span className="wallet-amount">
                        {currency}{(currentUser.wallet_balance || 0).toLocaleString()}
                    </span>
                </Link>

                {/* Notifications (placeholder for now) */}
                <button className="header-icon-btn">
                    <Bell size={20} />
                    {/* <span className="notification-badge">3</span> */}
                </button>

                {/* User Menu */}
                <div className="header-user">
                    <User size={18} />
                    <span className="username">{currentUser.username}</span>
                </div>
            </div>
        </div>
    );
}
