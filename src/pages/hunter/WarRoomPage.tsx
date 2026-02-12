import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Paperclip, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import SubmissionModal from '../../components/hunter/SubmissionModal';

const MOCK_MESSAGES = [
    { id: 1, sender: 'Payer', text: 'Welcome to the hunt. I need this done by Friday.', time: '10:00 AM', isMe: false },
    { id: 2, sender: 'Hunter', text: 'Understood. Starting the wireframes now.', time: '10:05 AM', isMe: true },
    { id: 3, sender: 'Payer', text: 'Great. Please share a draft when ready.', time: '10:10 AM', isMe: false },
];

const WarRoomPage = () => {
    // const { bountyId } = useParams(); // Reserved for API integration
    const navigate = useNavigate();
    // const { profile } = useAuth(); // Reserved
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

    // Mock Bounty Details
    const bounty = {
        title: 'Fintech Dashboard UI Design',
        status: 'In Progress',
        deadline: '2 days left',
        reward: 15000,
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            sender: 'Hunter',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const handleSubmission = async (data: { workUrl: string; notes: string }) => {
        console.log("Submitting:", data);

        // Add a system message locally to reflect action
        const msg = {
            id: messages.length + 1,
            sender: 'System',
            text: `🎯 WORK SUBMITTED: ${data.workUrl}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages(prev => [...prev, msg]);

        return new Promise<void>(resolve => setTimeout(resolve, 1000));
    };


    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 relative">
            <SubmissionModal
                isOpen={isSubmissionOpen}
                onClose={() => setIsSubmissionOpen(false)}
                onSubmit={handleSubmission}
            />

            {/* Chat Area */}
            <div className="flex-grow flex flex-col bg-iq-secondary/30 rounded-xl border border-iq-border overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-iq-border flex items-center justify-between bg-iq-secondary/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="md:hidden p-2 hover:bg-white/5 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="font-bold">{bounty.title}</h2>
                            <div className="flex items-center gap-2 text-xs text-iq-text-secondary">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live War Room
                            </div>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-iq-text-secondary">Reward</p>
                        <p className="font-bold text-iq-green">₹{bounty.reward.toLocaleString()}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 ${msg.isMe
                                    ? 'bg-iq-green text-iq-black rounded-tr-none'
                                    : 'bg-iq-secondary border border-iq-border rounded-tl-none'
                                }`}>
                                {!msg.isMe && <p className="text-xs font-bold mb-1 opacity-70">{msg.sender}</p>}
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'opacity-70' : 'text-iq-text-secondary'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-iq-border bg-iq-secondary/50 backdrop-blur-sm">
                    <div className="flex gap-2">
                        <button type="button" className="p-3 text-iq-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your strategy..."
                            className="flex-grow bg-iq-black border border-iq-border rounded-lg px-4 focus:border-iq-green outline-none text-white"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-iq-green text-iq-black rounded-lg hover:shadow-[0_0_10px_rgba(0,255,157,0.4)] transition-all font-bold"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar / Actions */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                {/* Status Card */}
                <div className="bg-iq-secondary/30 rounded-xl border border-iq-border p-5 space-y-4">
                    <h3 className="font-bold border-b border-iq-border pb-2">Mission Status</h3>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-iq-text-secondary flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Time Remaining
                        </span>
                        <span className="font-mono font-bold text-white">{bounty.deadline}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-iq-text-secondary flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Status
                        </span>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs uppercase font-bold">
                            {bounty.status}
                        </span>
                    </div>
                </div>

                {/* Submission Action */}
                <div className="bg-iq-secondary/30 rounded-xl border border-iq-border p-5 text-center">
                    <div className="w-12 h-12 bg-iq-green/10 rounded-full flex items-center justify-center mx-auto mb-3 text-iq-green">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Ready to Submit?</h3>
                    <p className="text-xs text-iq-text-secondary mb-4">
                        Ensure all requirements are met before final submission. Changes cannot be made after review starts.
                    </p>
                    <button
                        onClick={() => setIsSubmissionOpen(true)}
                        className="w-full py-3 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all"
                    >
                        Submit Work
                    </button>
                </div>
            </div>

        </div>
    );
};

export default WarRoomPage;
