import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import {
    Clock, Target, AlertCircle, MessageSquare, Paperclip,
    Send, CheckCircle, FileText, User
} from 'lucide-react';

export default function PayerWarRoom() {
    const { currentUser } = useAuth();
    const [activeBounties, setActiveBounties] = useState([]);
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        loadActiveBounties();
    }, [currentUser]);

    async function loadActiveBounties() {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .select(`
                    *,
                    hunter_count:hunter_stakes(count),
                    submission_count:submissions(count)
                `)
                .eq('payer_id', currentUser.id)
                .eq('status', 'live')
                .order('submission_deadline', { ascending: true });

            if (error) throw error;
            setActiveBounties(data || []);
            if (data && data.length > 0) setSelectedBounty(data[0]);
        } catch (error) {
            console.error('Error loading bounties:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date()
        }]);
        setNewMessage('');
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-10 h-10 border-4 border-iq-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-fade-in pb-20 md:pb-0">
            {/* Sidebar List */}
            <div className="w-full md:w-80 flex-shrink-0 flex flex-col bg-iq-card border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <Target size={20} className="text-iq-primary" /> Active Missions
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeBounties.length === 0 ? (
                        <div className="p-8 text-center text-iq-text-secondary">
                            <p>No active missions.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {activeBounties.map(bounty => (
                                <button
                                    key={bounty.id}
                                    onClick={() => setSelectedBounty(bounty)}
                                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${selectedBounty?.id === bounty.id ? 'bg-iq-primary/5 border-l-2 border-iq-primary' : ''
                                        }`}
                                >
                                    <h3 className={`font-medium truncate ${selectedBounty?.id === bounty.id ? 'text-iq-primary' : 'text-white'}`}>
                                        {bounty.title}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2 text-xs text-iq-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {Math.ceil((new Date(bounty.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24))}d left
                                        </span>
                                        <span className="bg-white/10 px-1.5 py-0.5 rounded">
                                            {bounty.hunter_count?.[0]?.count || 0} Hunters
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {selectedBounty ? (
                <div className="flex-1 flex flex-col bg-iq-card border border-white/5 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div>
                            <h2 className="font-bold text-white text-lg">{selectedBounty.title}</h2>
                            <p className="text-xs text-iq-text-secondary">Mission Control</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-iq-text-secondary hover:text-white" title="View Details">
                                <FileText size={18} />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-iq-text-secondary hover:text-white" title="Report Issue">
                                <AlertCircle size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Feed / Timeline */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {/* Status Card */}
                            <div className="bg-iq-surface rounded-xl p-4 border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-iq-primary/20 flex items-center justify-center text-iq-primary">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-iq-text-secondary">Time Remaining</p>
                                        <p className="text-xl font-bold text-white">
                                            {Math.ceil((new Date(selectedBounty.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24))} Days
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div className="text-right">
                                    <p className="text-sm text-iq-text-secondary">Budget Locked</p>
                                    <p className="text-xl font-bold text-iq-success">Locked</p>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-iq-text-secondary uppercase tracking-wider">Mission Timeline</h3>

                                <div className="relative pl-4 border-l border-white/10 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-iq-success ring-4 ring-iq-card"></div>
                                        <p className="text-sm text-white font-medium">Bounty Posted</p>
                                        <p className="text-xs text-iq-text-secondary">{new Date(selectedBounty.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-iq-primary ring-4 ring-iq-card"></div>
                                        <p className="text-sm text-white font-medium">Hunters Joined</p>
                                        <p className="text-xs text-iq-text-secondary">{selectedBounty.hunter_count?.[0]?.count || 0} active participants</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-white/20 ring-4 ring-iq-card"></div>
                                        <p className="text-sm text-iq-text-secondary font-medium">Submission Deadline</p>
                                        <p className="text-xs text-iq-text-secondary">{new Date(selectedBounty.submission_deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat / Updates */}
                        <div className="w-full md:w-80 bg-iq-surface border-l border-white/5 flex flex-col">
                            <div className="p-3 border-b border-white/5 bg-white/5">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <MessageSquare size={16} /> Updates & Chat
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-iq-primary/20 flex items-center justify-center text-xs font-bold text-iq-primary shrink-0">
                                        AI
                                    </div>
                                    <div className="bg-iq-card p-3 rounded-lg rounded-tl-none border border-white/5 text-sm text-iq-text-secondary">
                                        Welcome to the War Room. Keep track of your mission status here.
                                    </div>
                                </div>
                                {messages.map(msg => (
                                    <div key={msg.id} className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                            ME
                                        </div>
                                        <div className="bg-iq-primary/10 p-3 rounded-lg rounded-tr-none border border-iq-primary/20 text-sm text-white">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 flex gap-2">
                                <button type="button" className="p-2 text-iq-text-secondary hover:text-white">
                                    <Paperclip size={18} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Post update..."
                                    className="flex-1 bg-iq-background border-none text-sm text-white focus:ring-0 placeholder-white/20"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="p-2 text-iq-primary hover:text-white transition-colors">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-iq-text-secondary">
                    <Target size={48} className="mb-4 opacity-50" />
                    <p>Select a mission to enter the War Room</p>
                </div>
            )}
        </div>
    );
}
