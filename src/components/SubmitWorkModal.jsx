import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Upload, FileText, X, AlertCircle, Send } from 'lucide-react';

export default function SubmitWorkModal({ bounty, onClose, onSuccess }) {
    const { currentUser } = useAuth();
    const [submissionText, setSubmissionText] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                setError('File must be less than 50MB');
                return;
            }
            setSubmissionFile(file);
            setError(null);
        }
    }

    async function uploadSubmissionFile() {
        if (!submissionFile) return null;

        const fileName = `${Date.now()}_${submissionFile.name}`;
        const filePath = `submissions/${bounty.id}/${currentUser.id}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('bounty-submissions')
            .upload(filePath, submissionFile);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('bounty-submissions')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!submissionText.trim() && !submissionFile) {
            setError('Please provide either submission notes or upload a file');
            return;
        }

        const confirmed = window.confirm(
            `Submit your work for "${bounty.title}"?\n\n` +
            `⚠️ Make sure your submission is complete\n` +
            `⚠️ You can only submit once per bounty\n` +
            `⚠️ The payer will review all submissions`
        );

        if (!confirmed) return;

        setUploading(true);
        setError(null);

        try {
            // Upload file if provided
            let fileUrl = null;
            if (submissionFile) {
                fileUrl = await uploadSubmissionFile();
                if (!fileUrl) throw new Error('Failed to upload file');
            }

            // Submit work via RPC
            const { data, error: rpcError } = await supabase.rpc('submit_work', {
                p_bounty_id: bounty.id,
                p_hunter_id: currentUser.id,
                p_submission_text: submissionText.trim() || null,
                p_submission_file_url: fileUrl
            });

            if (rpcError) throw rpcError;

            if (data.success) {
                alert('✅ Submission successful!\n\nYour work has been submitted for review.');
                onSuccess();
            } else {
                throw new Error(data.error || 'Failed to submit work');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit work. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content submit-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2>Submit Your Work</h2>
                        <p className="modal-subtitle">{bounty.title}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="modal-form">
                    {error && (
                        <div className="error-banner">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {/* Submission Notes */}
                    <div className="form-group">
                        <label htmlFor="submission_text">
                            <FileText size={18} />
                            Submission Notes
                        </label>
                        <textarea
                            id="submission_text"
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            placeholder="Describe your approach, methodology, key findings, or any notes for the payer..."
                            rows={6}
                            maxLength={2000}
                        />
                        <small>{submissionText.length}/2000 characters</small>
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                        <label htmlFor="submission_file">
                            <Upload size={18} />
                            Upload Submission File (Optional, Max 50MB)
                        </label>
                        <div className="file-upload-area">
                            <input
                                type="file"
                                id="submission_file"
                                onChange={handleFileChange}
                                className="file-input"
                                disabled={uploading}
                            />
                            <div className="file-upload-label">
                                {submissionFile ? (
                                    <>
                                        <FileText size={32} />
                                        <span className="file-name">{submissionFile.name}</span>
                                        <span className="file-size">
                                            {(submissionFile.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} />
                                        <span>Click to upload your completed work</span>
                                        <small>PDF, ZIP, images, documents, or any deliverable file</small>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="info-box">
                        <AlertCircle size={20} />
                        <div>
                            <strong>Before Submitting:</strong>
                            <ul>
                                <li>Ensure your work meets all requirements in the mission PDF</li>
                                <li>You can only submit <strong>once</strong> per bounty</li>
                                <li>The payer will review all submissions and select the winner</li>
                                <li>Winner is chosen based on quality, not submission order</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={uploading || (!submissionText.trim() && !submissionFile)}
                        >
                            {uploading ? (
                                'Submitting...'
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Work
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
