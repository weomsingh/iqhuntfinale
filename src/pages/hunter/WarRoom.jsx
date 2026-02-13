import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Clock, MessageCircle, Send, Target, Users, AlertCircle } from 'lucide-react';

export default function HunterWarRoom() {
    const { currentUser } = useAuth();
    const [activeBounty, setActiveBounty] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [timer, setTimer] = useState({});
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            loadActiveBounty();
        }
    }, [currentUser]);

    async function loadActiveBounty() {
        try {
            // Get hunter's active stake
            const { data: stakeData, error: stakeError } = await supabase
                .from('hunter_stakes')
                .select(`
                    *,
                    bounty:bounties(*)
                `)
                .eq('hunter_id', currentUser.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (stakeError && stakeError.code !== 'PGRST116') throw stakeError;
            if (!stakeData) {
                setLoading(false);
                return;
            }

            setActiveBounty(stakeData.bounty);

            // Load chat messages for this bounty
            loadMessages(stakeData.bounty.id);

            // Subscribe to new messages
            const channel = supabase
                .channel(`war-room-${stakeData.bounty.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'war_room_messages',
                    filter: `bounty_id=eq.${stakeData.bounty.id}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } catch (error) {
            console.error('Error loading active bounty:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadMessages(bountyId) {
        try {
            const { data, error } = await supabase
                .from('war_room_messages')
                .select(`
                    *,
                    sender:profiles(username)
                `)
                .eq('bounty_id', bountyId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async function sendMessage(e) {
        e.preventDefault();

        if (!newMessage.trim()) return;

        try {
            const { error } = await supabase
                .from('war_room_messages')
                .insert({
                    bounty_id: activeBounty.id,
                    sender_id: currentUser.id,
                    message: newMessage.trim()
                });

            if (error) throw error;

            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
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
            seconds
        };
    }

    useEffect(() => {
        if (!activeBounty) return;

        const interval = setInterval(() => {
            setTimer(calculateTimeRemaining(activeBounty.submission_deadline));
        }, 1000);

        return () => clearInterval(interval);
    }, [activeBounty]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    if (loading) {
        return (
            <div className="war-room-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading war room...</p>
                </div>
            </div>
        );
    }

    if (!activeBounty) {
        return (
            <div className="war-room-page">
                <div className="dashboard-hero">
                    <div>
                        <h1>War Room ⚔️</h1>
                        <p className="hero-subtitle">
                            Your mission control center
                        </p>
                    </div>
                </div>

                <div className="empty-state">
                    <Target size={64} />
                    <h3>No Active Mission</h3>
                    <p>Stake on a bounty to enter the War Room</p>
                    <button
                        className="btn-primary"
                        onClick={() => window.location.href = '/hunter/arena'}
                    >
                        Browse Bounties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="war-room-page hunter">
            <div className="war-room-header">
                <div>
                    <h1>War Room ⚔️</h1>
                    <p className="bounty-title">{activeBounty.title}</p>
                    <span className="bounty-reward">
                        Reward: {currency}{activeBounty.reward.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Countdown Timer */}
            <div className={`war-room-countdown ${timer.expired ? 'expired' : ''}`}>
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

            {/* Chat Room */}
            <div className="war-room-chat">
                <div className="chat-header">
                    <MessageCircle size={20} />
                    <h3>Hunter's Chat</h3>
                    <span className="chat-info">
                        <Users size={16} />
                        {activeBounty.max_hunters} Hunters
                    </span>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="empty-chat">
                            <MessageCircle size={32} />
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.sender_id === currentUser.id ? 'own' : ''}`}
                            >
                                <div className="message-header">
                                    <span className="message-sender">
                                        {msg.sender_id === currentUser.id ? 'You' : msg.sender?.username}
                                    </span>
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="message-content">{msg.message}</div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="chat-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        maxLength={500}
                    />
                    <button type="submit" disabled={!newMessage.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </div>

            <div className="war-room-info">
                <AlertCircle size={16} />
                <p>
                    All chat messages are ephemeral and purged immediately upon mission completion.
                    Mission PDFs are encrypted and secure.
                </p>
            </div>
        </div>
    );
}
