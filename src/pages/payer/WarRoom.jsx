import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Clock, Target, AlertCircle } from 'lucide-react';

export default function PayerWarRoom() {
    const { currentUser } = useAuth();
    const [liveBounties, setLiveBounties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadLiveBounties();
        }
    }, [currentUser]);

    async function loadLiveBounties() {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .select('*')
                .eq('payer_id', currentUser.id)
                .eq('status', 'live')
                .order('submission_deadline', { ascending: true });

            if (error) throw error;
            setLiveBounties(data || []);
        } catch (error) {
            console.error('Error loading bounties:', error);
        } finally {
            setLoading(false);
        }
    }

    function calculateTimeRemaining(deadline) {
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;

        if (diff <= 0) {
            return { expired: true, display: 'EXPIRED' };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            expired: false,
            days,
            hours,
            minutes,
            seconds,
            display: `${days}d ${hours}h ${minutes}m ${seconds}s`
        };
    }

    const [timers, setTimers] = useState({});

    useEffect(() => {
        if (liveBounties.length === 0) return;

        const interval = setInterval(() => {
            const newTimers = {};
            liveBounties.forEach(bounty => {
                newTimers[bounty.id] = calculateTimeRemaining(bounty.submission_deadline);
            });
            setTimers(newTimers);
        }, 1000);

        return () => clearInterval(interval);
    }, [liveBounties]);

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    return (
        <div className="war-room-page">
            <div className="dashboard-hero">
                <div>
                    <h1>War Room ⏱️</h1>
                    <p className="hero-subtitle">
                        Track your active bounty deadlines in real-time
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading war room...</p>
                </div>
            ) : liveBounties.length === 0 ? (
                <div className="empty-state">
                    <Target size={64} />
                    <h3>No Active Bounties</h3>
                    <p>You don't have any live bounties with active deadlines</p>
                </div>
            ) : (
                <div className="war-room-timers">
                    {liveBounties.map(bounty => {
                        const timer = timers[bounty.id] || {};

                        return (
                            <div key={bounty.id} className="war-room-timer-card">
                                <div className="timer-card-header">
                                    <div>
                                        <h3>{bounty.title}</h3>
                                        <p className="timer-card-reward">
                                            Reward: {currency}{bounty.reward.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="status-badge live">
                                        <Clock size={14} />
                                        Live
                                    </span>
                                </div>

                                <div className={`countdown-display ${timer.expired ? 'expired' : ''}`}>
                                    {timer.expired ? (
                                        <>
                                            <AlertCircle size={48} />
                                            <span className="countdown-expired">DEADLINE PASSED</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="countdown-segment">
                                                <span className="countdown-value">{timer.days || 0}</span>
                                                <span className="countdown-label">Days</span>
                                            </div>
                                            <span className="countdown-separator">:</span>
                                            <div className="countdown-segment">
                                                <span className="countdown-value">{String(timer.hours || 0).padStart(2, '0')}</span>
                                                <span className="countdown-label">Hours</span>
                                            </div>
                                            <span className="countdown-separator">:</span>
                                            <div className="countdown-segment">
                                                <span className="countdown-value">{String(timer.minutes || 0).padStart(2, '0')}</span>
                                                <span className="countdown-label">Minutes</span>
                                            </div>
                                            <span className="countdown-separator">:</span>
                                            <div className="countdown-segment">
                                                <span className="countdown-value">{String(timer.seconds || 0).padStart(2, '0')}</span>
                                                <span className="countdown-label">Seconds</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="timer-card-footer">
                                    <span>Deadline: {new Date(bounty.submission_deadline).toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
