import { useState } from 'react';
import { X, Link as LinkIcon, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { workUrl: string; notes: string }) => Promise<void>;
}

const SubmissionModal = ({ isOpen, onClose, onSubmit }: SubmissionModalProps) => {
    const [workUrl, setWorkUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workUrl.trim()) return;

        setLoading(true);
        try {
            await onSubmit({ workUrl, notes });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-iq-secondary border border-iq-border rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">

                <div className="flex items-center justify-between p-6 border-b border-iq-border">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-iq-green" />
                        Final Submission
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-iq-text-secondary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="p-4 bg-iq-green/10 border border-iq-green/20 rounded-xl text-sm text-iq-green">
                        <strong className="block mb-1">Once submitted, the review begins.</strong>
                        Make sure your work is publicly accessible and meets all requirements.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-iq-text-secondary flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" /> Work URL
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://github.com/username/repo"
                            value={workUrl}
                            onChange={(e) => setWorkUrl(e.target.value)}
                            className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-iq-text-secondary flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Release Notes
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Briefly describe your solution, tech stack, and any specific instructions for the reviewer..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-iq-black border border-iq-border text-white font-bold rounded-lg hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Submission'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default SubmissionModal;
