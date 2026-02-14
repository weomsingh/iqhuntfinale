import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Upload, AlertCircle, DollarSign, Clock, Target, FileText, Calendar, Info } from 'lucide-react';

export default function PostBounty() {
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reward: '',
        submission_deadline: '',
        mission_pdf_url: ''
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const currency = currentUser?.currency === 'INR' ? '₹' : '$';

    // Calculate stake price based on reward (for INR only)
    function calculateStakePrice(reward) {
        if (currentUser?.currency !== 'INR') {
            return { stake: 0, maxHunters: 10 }; // For USD, set manually
        }

        const amount = parseFloat(reward);

        if (amount < 1500) {
            return { stake: 15, maxHunters: 4 };
        } else if (amount < 3000) {
            return { stake: 25, maxHunters: 6 };
        } else if (amount < 4500) {
            return { stake: 40, maxHunters: 8 };
        } else {
            return { stake: Math.ceil(amount * 0.025), maxHunters: 10 };
        }
    }

    const stakeInfo = formData.reward ? calculateStakePrice(formData.reward) : { stake: 0, maxHunters: 0 };

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
        // CHANGED: Removed 'mission-pdfs/' prefix to match RLS policy which expects root folder to be userID
        const filePath = `${currentUser.id}/${fileName}`;

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
                    entry_fee: stakeInfo.stake,
                    max_hunters: stakeInfo.maxHunters,
                    currency: currentUser.currency || 'INR', // Added fallback
                    submission_deadline: formData.submission_deadline,
                    mission_pdf_url: pdfUrl,
                    status: 'live',
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
                    currency: currentUser.currency || 'INR', // Added fallback
                    status: 'completed',
                    metadata: { bounty_id: bountyData.id }
                });

            alert(`✅ Bounty created successfully!\n\nTitle: ${formData.title}\nReward: ${currency}${parseFloat(formData.reward).toLocaleString()}`);

            await refreshUser();
            navigate('/payer/dashboard');

        } catch (error) {
            console.error('Error creating bounty:', error);
            // IMPROVED: Show detailed error message
            alert(`Failed to create bounty: ${error.message || error.details || JSON.stringify(error)}`);
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

                {/* Reward */}
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

                    {/* Stake Calculator Info */}
                    {formData.reward && stakeInfo.stake > 0 && (
                        <div className="stake-info-box" style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(0, 255, 157, 0.05)',
                            border: '1px solid rgba(0, 255, 157, 0.2)',
                            borderRadius: '8px'
                        }}>
                            <strong style={{ color: '#00ff9d', display: 'block', marginBottom: '0.5rem' }}>
                                🎯 Platform Calculated Stakes:
                            </strong>
                            <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                                <p style={{ margin: '0.25rem 0' }}>
                                    • Hunter Entry Fee: <strong>{currency}{stakeInfo.stake}</strong>
                                </p>
                                <p style={{ margin: '0.25rem 0' }}>
                                    • Max Hunters: <strong>{stakeInfo.maxHunters}</strong>
                                </p>
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#888' }}>
                                    Stakes are automatically calculated based on your reward amount
                                </p>
                                <button
                                    type="button"
                                    onClick={() => window.open('/pricing', '_blank')}
                                    style={{
                                        marginTop: '0.75rem',
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(0, 255, 157, 0.1)',
                                        border: '1px solid rgba(0, 255, 157, 0.3)',
                                        borderRadius: '6px',
                                        color: '#00ff9d',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(0, 255, 157, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(0, 255, 157, 0.1)';
                                    }}
                                >
                                    <Info size={16} />
                                    View Full Pricing Guide
                                </button>
                            </div>
                        </div>
                    )}
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
