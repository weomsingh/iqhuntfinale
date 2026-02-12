import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useParams
import {
    ArrowLeft, Clock, ExternalLink,
    XCircle, MessageSquare, Award, AlertTriangle
} from 'lucide-react';

// Mock Data
const MOCK_SUBMISSIONS = [
    {
        id: 1,
        hunterName: 'CyberRonin',
        hunterAvatar: 'C',
        submittedAt: '2 hours ago',
        workUrl: 'https://figma.com/file/xyz...',
        notes: 'Here is the high-fidelity prototype. Includes dark mode and mobile variants.',
        status: 'Pending'
    },
    {
        id: 2,
        hunterName: 'PixelNinja',
        hunterAvatar: 'P',
        submittedAt: '1 day ago',
        workUrl: 'https://dribbble.com/shots/...',
        notes: 'Focusing on clean typography and neon accents as requested.',
        status: 'Rejected'
    },
    {
        id: 3,
        hunterName: 'CodeSamurai',
        hunterAvatar: 'S',
        submittedAt: '30 mins ago',
        workUrl: 'https://github.com/codesamurai/repo',
        notes: 'Full implementation ready for review.',
        status: 'Pending'
    }
];

const BountyManagementPage = () => {
    // const { id } = useParams(); // Unused
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('submissions');

    // Mock Bounty Details
    const bounty = {
        title: 'Fintech Dashboard UI Design',
        status: 'Active',
        reward: 15000,
        deadline: '2 days left',
        description: 'Design a futuristic, dark-mode fintech dashboard...'
    };

    const handleApprove = (submissionId: number) => {
        alert(`Approving submission ${submissionId} (Mock functionality)`);
    };

    const handleReject = (submissionId: number) => {
        alert(`Rejecting submission ${submissionId} (Mock functionality)`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/payer/bounties')}
                    className="p-2 hover:bg-white/5 rounded-full text-iq-text-secondary hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{bounty.title}</h1>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-bold uppercase rounded border border-green-500/20">
                            {bounty.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-iq-border flex gap-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'overview' ? 'text-blue-400' : 'text-iq-text-secondary hover:text-white'
                        }`}
                >
                    Overview
                    {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'submissions' ? 'text-blue-400' : 'text-iq-text-secondary hover:text-white'
                        }`}
                >
                    Submissions <span className="ml-2 bg-white/10 px-1.5 py-0.5 rounded-full text-xs">3</span>
                    {activeTab === 'submissions' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'settings' ? 'text-blue-400' : 'text-iq-text-secondary hover:text-white'
                        }`}
                >
                    Settings
                    {activeTab === 'settings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'submissions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-blue-400">Review Process</h3>
                            <p className="text-xs text-blue-200/80 mt-1">
                                Selecting a winner will automatically release the funds from escrow to the hunter's wallet.
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {MOCK_SUBMISSIONS.map((submission) => (
                            <div key={submission.id} className="bg-iq-secondary/30 border border-iq-border rounded-xl p-6">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">

                                    {/* Hunter Info */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-iq-secondary border border-iq-border flex items-center justify-center text-xl font-bold text-white">
                                            {submission.hunterAvatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{submission.hunterName}</h3>
                                            <p className="text-xs text-iq-text-secondary flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Submitted {submission.submittedAt}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submission Content */}
                                    <div className="flex-grow bg-black/20 rounded-lg p-4 border border-iq-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-iq-text-secondary uppercase tracking-wider">Work Link</span>
                                            <a
                                                href={submission.workUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 font-medium"
                                            >
                                                {submission.workUrl} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <p className="text-iq-text-secondary text-sm italic">"{submission.notes}"</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-colors">
                                            <MessageSquare className="w-4 h-4" /> Message
                                        </button>

                                        {submission.status === 'Pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(submission.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-iq-black rounded-lg text-sm font-bold transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                                >
                                                    <Award className="w-4 h-4" /> Award Winner
                                                </button>
                                                <button
                                                    onClick={() => handleReject(submission.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center py-2">
                                                <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${submission.status === 'Rejected'
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    }`}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-8 text-center text-iq-text-secondary">
                    <p>Bounty Overview stats and detailed description will be shown here.</p>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-8 text-center text-iq-text-secondary">
                    <p>Bounty settings (edit, cancel, extend deadline) will be available here.</p>
                </div>
            )}

        </div>
    );
};

export default BountyManagementPage;
