import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Upload, AlertCircle, DollarSign, Clock, Target, FileText, Calendar } from 'lucide-react';

export default function PostBounty() {
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reward: '',
        entry_fee: '',
        submission_deadline: '',
        mission_pdf_url: ''
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }

    function handlePdfChange(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setErrors(prev => ({ ...prev, pdf: 'Only PDF files are allowed' }));
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setErrors(prev => ({ ...prev, pdf: 'PDF must be less than 10MB' }));
                return;
            }
            setPdfFile(file);
            setErrors(prev => ({ ...prev, pdf: null }));
        }
    }

    function validateForm() {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.reward || parseFloat(formData.reward) <= 0) {
            newErrors.reward = 'Reward must be greater than 0';
        }
        if (!formData.entry_fee || parseFloat(formData.entry_fee) <= 0) {
            newErrors.entry_fee = 'Entry fee must be greater than 0';
        }
        if (!formData.submission_deadline) {
            newErrors.submission_deadline = 'Deadline is required';
        } else {
            const deadline = new Date(formData.submission_deadline);
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + 1); // At least 1 day from now
            if (deadline < minDate) {
                newErrors.submission_deadline = 'Deadline must be at least 1 day in the future';
            }
        }
        if (!pdfFile) newErrors.pdf = 'Mission PDF is required';

        // Check vault balance (105% of reward)
        const requiredVault = parseFloat(formData.reward) * 1.05;
        if (currentUser.wallet_balance < requiredVault) {
            newErrors.vault = `Insufficient vault balance! You need ${currency}${requiredVault.toFixed(2)} (105% of reward)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function uploadPdf() {
        if (!pdfFile) return null;

        const fileName = `${Date.now()}_${pdfFile.name}`;
        const filePath = `mission-pdfs/${currentUser.id}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('bounty-missions')
            .upload(filePath, pdfFile);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('bounty-missions')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fix the errors before submitting');
            return;
        }

        const confirmed = window.confirm(
            `Create bounty with reward of ${currency}${parseFloat(formData.reward).toLocaleString()}?\n\n` +
            `⚠️ ${currency}${(parseFloat(formData.reward) * 1.05).toFixed(2)} will be locked in your vault\n` +
            `⚠️ This cannot be undone once hunters start staking`
        );

        if (!confirmed) return;

        setUploading(true);

        try {
            // Upload PDF
            const pdfUrl = await uploadPdf();

            if (!pdfUrl) {
                throw new Error('Failed to upload mission PDF');
            }

            // Create bounty
            const { data: bountyData, error: bountyError } = await supabase
                .from('bounties')
                .insert({
                    payer_id: currentUser.id,
                    title: formData.title,
                    description: formData.description,
                    reward: parseFloat(formData.reward),
                    entry_fee: parseFloat(formData.entry_fee),
                    currency: currentUser.currency,
                    submission_deadline: formData.submission_deadline,
                    mission_pdf_url: pdfUrl,
                    status: 'live', // Auto-approve for now (will add admin approval later)
                    vault_locked: parseFloat(formData.reward) * 1.05
                })
                .select()
                .single();

            if (bountyError) throw bountyError;

            // Deduct vault amount from payer balance
            const newBalance = currentUser.wallet_balance - (parseFloat(formData.reward) * 1.05);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ wallet_balance: newBalance })
                .eq('id', currentUser.id);

            if (updateError) throw updateError;

            // Create transaction record
            await supabase
                .from('transactions')
                .insert({
                    user_id: currentUser.id,
                    type: 'lock_vault',
                    amount: parseFloat(formData.reward) * 1.05,
                    currency: currentUser.currency,
                    status: 'completed',
                    metadata: { bounty_id: bountyData.id }
                });

            alert(`✅ Bounty created successfully!\n\nTitle: ${formData.title}\nReward: ${currency}${parseFloat(formData.reward).toLocaleString()}`);

            await refreshUser();
            navigate('/payer/dashboard');

        } catch (error) {
            console.error('Error creating bounty:', error);
            alert('Failed to create bounty. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    const requiredVault = formData.reward ? (parseFloat(formData.reward) * 1.05).toFixed(2) : '0.00';
    const hasEnoughBalance = formData.reward ? currentUser.wallet_balance >= parseFloat(requiredVault) : true;

    return (
        <div className="post-bounty-page">
            <div className="page-header">
                <h1>Post New Bounty</h1>
                <p className="page-subtitle">
                    Create a new challenge for hunters. 105% of reward will be locked in your vault.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bounty-form">
                {/* Title */}
                <div className="form-group">
                    <label htmlFor="title">
                        <Target size={18} />
                        Bounty Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Design a Landing Page for SaaS Product"
                        className={errors.title ? 'error' : ''}
                        maxLength={100}
                    />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">
                        <FileText size={18} />
                        Brief Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Summarize the mission (full details should be in the PDF)"
                        rows={4}
                        className={errors.description ? 'error' : ''}
                        maxLength={500}
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                    <small>{formData.description.length}/500</small>
                </div>

                {/* Reward & Entry Fee */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="reward">
                            <DollarSign size={18} />
                            Winner Reward ({currency}) *
                        </label>
                        <input
                            type="number"
                            id="reward"
                            name="reward"
                            value={formData.reward}
                            onChange={handleChange}
                            placeholder="10000"
                            min="1"
                            step="0.01"
                            className={errors.reward ? 'error' : ''}
                        />
                        {errors.reward && <span className="error-text">{errors.reward}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="entry_fee">
                            <Target size={18} />
                            Hunter Entry Fee ({currency}) *
                        </label>
                        <input
                            type="number"
                            id="entry_fee"
                            name="entry_fee"
                            value={formData.entry_fee}
                            onChange={handleChange}
                            placeholder="500"
                            min="1"
                            step="0.01"
                            className={errors.entry_fee ? 'error' : ''}
                        />
                        {errors.entry_fee && <span className="error-text">{errors.entry_fee}</span>}
                    </div>
                </div>

                {/* Deadline */}
                <div className="form-group">
                    <label htmlFor="submission_deadline">
                        <Calendar size={18} />
                        Submission Deadline *
                    </label>
                    <input
                        type="datetime-local"
                        id="submission_deadline"
                        name="submission_deadline"
                        value={formData.submission_deadline}
                        onChange={handleChange}
                        className={errors.submission_deadline ? 'error' : ''}
                    />
                    {errors.submission_deadline && <span className="error-text">{errors.submission_deadline}</span>}
                </div>

                {/* Mission PDF Upload */}
                <div className="form-group">
                    <label htmlFor="pdf">
                        <Upload size={18} />
                        Mission PDF * (Max 10MB)
                    </label>
                    <div className="file-upload-area">
                        <input
                            type="file"
                            id="pdf"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            className="file-input"
                        />
                        <div className="file-upload-label">
                            {pdfFile ? (
                                <>
                                    <FileText size={32} />
                                    <span className="file-name">{pdfFile.name}</span>
                                    <span className="file-size">
                                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Upload size={32} />
                                    <span>Click to upload mission PDF</span>
                                    <small>Full mission details, requirements, and deliverables</small>
                                </>
                            )}
                        </div>
                    </div>
                    {errors.pdf && <span className="error-text">{errors.pdf}</span>}
                </div>

                {/* Vault Info */}
                <div className={`vault-info ${hasEnoughBalance ? 'success' : 'warning'}`}>
                    <AlertCircle size={20} />
                    <div className="vault-info-content">
                        <strong>Vault Requirement</strong>
                        <p>
                            {currency}{requiredVault} will be locked (105% of reward)
                        </p>
                        <p className="balance-check">
                            Your balance: {currency}{currentUser.wallet_balance.toLocaleString()}
                            {!hasEnoughBalance && (
                                <span className="insufficient"> - INSUFFICIENT!</span>
                            )}
                        </p>
                    </div>
                </div>

                {errors.vault && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        {errors.vault}
                    </div>
                )}

                {/* Submit Button */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/payer/dashboard')}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={uploading || !hasEnoughBalance}
                    >
                        {uploading ? (
                            'Creating Bounty...'
                        ) : (
                            <>
                                <Target size={20} />
                                Deploy Bounty
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
