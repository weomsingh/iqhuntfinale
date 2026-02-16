import { Target, Users, Calendar, TrendingUp, Clock, AlertCircle, CheckCircle, Lock, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BountyCard({ bounty, userRole = 'hunter' }) {
    const { id, title, description, reward, currency, max_hunters, submission_deadline, status, entry_fee, difficulty = 'Medium', is_featured, is_urgent, payment_secured } = bounty;

    const symbol = currency === 'INR' ? '₹' : '$';
    const deadline = new Date(submission_deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
    const isExpired = daysLeft <= 0;

    // Count staked hunters (mock for now - will come from database)
    const stakedHunters = bounty.staked_count || 0;
    const slotsLeft = max_hunters - stakedHunters;

    return (
        <div className="group relative bg-iq-card border border-white/5 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-iq-primary/50 hover:shadow-glow cursor-pointer overflow-hidden flex flex-col h-full">

            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-iq-primary/0 via-iq-primary/5 to-iq-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Header */}
            <div className="relative flex justify-between items-start mb-4 z-10">
                <div className="flex flex-col gap-2">
                    {/* Category/Type Badge - Placeholder for now as it's not in bounty prop explicitly, using generic if missing */}
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-iq-surface border border-white/10 text-iq-text-secondary">
                            <Target size={12} />
                            {bounty.category || 'Bounty'}
                        </span>

                        {is_featured && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                ⭐ Featured
                            </span>
                        )}

                        {(is_urgent || isExpiringSoon) && !isExpired && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-iq-error/10 text-iq-error border border-iq-error/20">
                                🔥 Urgent
                            </span>
                        )}

                        {payment_secured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-iq-success/10 text-iq-success border border-iq-success/20">
                                <Lock size={10} />
                                Secured
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-gray-500 hover:text-iq-error transition-colors cursor-pointer p-1">
                    <Heart size={20} />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1">
                <h3 className="text-lg md:text-xl font-bold text-iq-text-primary mb-2 line-clamp-2 group-hover:text-iq-primary transition-colors">
                    {title}
                </h3>
                <p className="text-iq-text-secondary text-sm line-clamp-2 mb-6">
                    {description}
                </p>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-2 text-sm text-iq-text-secondary mb-6 p-3 bg-iq-surface/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className={isExpiringSoon ? 'text-iq-warning' : ''} />
                        <span className={isExpiringSoon ? 'text-iq-warning font-medium' : ''}>
                            {isExpired ? 'Expired' : `${daysLeft} days left`}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{stakedHunters}/{max_hunters} joined</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span className={
                            difficulty === 'Easy' ? 'text-iq-success' :
                                difficulty === 'Medium' ? 'text-iq-warning' : 'text-iq-error'
                        }>
                            {difficulty}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-iq-text-secondary mb-0.5">Reward</span>
                    <span className="text-xl md:text-2xl font-bold text-iq-primary tracking-tight">
                        {symbol}{reward.toLocaleString()}
                    </span>
                </div>

                {userRole === 'hunter' && status === 'live' && !isExpired && (
                    <Link
                        to={`/hunter/bounty/${id}`}
                        className="group/btn flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-iq-primary transition-all active:scale-95"
                    >
                        View Details
                        <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                )}
                {userRole === 'payer' && (
                    <Link
                        to={`/payer/bounty/${id}`}
                        className="group/btn flex items-center gap-2 px-5 py-2.5 bg-iq-surface text-white border border-white/10 font-medium rounded-lg hover:bg-white/10 transition-all active:scale-95"
                    >
                        Manage
                        <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>
        </div>
    );
}

