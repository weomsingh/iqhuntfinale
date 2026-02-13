import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Target, HelpCircle, AlertCircle } from 'lucide-react';

const EXPERTISE_TAGS = [
    'UI/UX Design', 'React Development', 'Python', 'Machine Learning',
    'Backend Engineering', '3D Animation', 'Mobile Development', 'DevOps',
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get role from localStorage (set on homepage)
    const intendedRole = localStorage.getItem('intended_role') || 'hunter';

    const [formData, setFormData] = useState({
        role: intendedRole,
        username: '',
        nationality: '',
        currency: '',
        expertise: [],
        bio: '',
        dob: '',
        is_organization: false,
        company_name: '',
        accepted_covenant: false,
    });

    const isStepValid = () => {
        if (step === 1) return formData.nationality && formData.currency;
        if (step === 2) {
            if (formData.role === 'hunter') {
                return formData.username && formData.dob && formData.expertise.length > 0;
            } else {
                return formData.username && (!formData.is_organization || formData.company_name);
            }
        }
        if (step === 3) return formData.accepted_covenant;
        return false;
    };

    async function handleComplete() {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Not authenticated');
            }

            const profileData = {
                id: user.id,
                email: user.email,
                role: formData.role,
                username: formData.username,
                nationality: formData.nationality,
                currency: formData.currency,
                accepted_covenant: formData.accepted_covenant,
                wallet_balance: 0,
                total_earnings: 0,
            };

            if (formData.role === 'hunter') {
                profileData.expertise = formData.expertise;
                profileData.bio = formData.bio;
                profileData.date_of_birth = formData.dob;
            } else {
                profileData.is_organization = formData.is_organization;
                profileData.company_name = formData.company_name;
            }

            const { error: insertError } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (insertError) throw insertError;

            // Clear intended role
            localStorage.removeItem('intended_role');

            // Navigate to dashboard
            if (formData.role === 'hunter') {
                navigate('/hunter/arena', { replace: true });
            } else {
                navigate('/payer/dashboard', { replace: true });
            }

        } catch (err) {
            console.error('Onboarding error:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="onboarding-page">
            {/* HEADER - NO "Cancel & Sign Out" */}
            <header className="onboarding-header">
                <div className="logo">
                    <Target size={24} />
                    <span>IQHUNT</span>
                </div>
                <button
                    className="help-btn"
                    onClick={() => window.open('mailto:iqhuntarena@gmail.com')}
                >
                    <HelpCircle size={20} />
                    Need Help?
                </button>
            </header>

            <div className="onboarding-container">
                {/* Progress Bar */}
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
                </div>

                <h1>Complete Your Profile</h1>
                <p className="onboarding-subtitle">
                    You're joining as a <strong>{intendedRole === 'hunter' ? 'Hunter' : 'Payer'}</strong>
                </p>

                {/* NO ROLE SELECTION - Already set from homepage */}

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* STEP 1: Nationality */}
                {step === 1 && (
                    <div className="form-step">
                        <h2>Select Your Region</h2>
                        <div className="region-buttons">
                            <button
                                className={`region-btn ${formData.nationality === 'india' ? 'selected' : ''}`}
                                onClick={() => setFormData({
                                    ...formData,
                                    nationality: 'india',
                                    currency: 'INR'
                                })}
                            >
                                <span className="flag">🇮🇳</span>
                                <span>India (INR)</span>
                            </button>
                            <button
                                className={`region-btn ${formData.nationality === 'global' ? 'selected' : ''}`}
                                onClick={() => setFormData({
                                    ...formData,
                                    nationality: 'global',
                                    currency: 'USD'
                                })}
                            >
                                <span className="flag">🌍</span>
                                <span>Global (USD)</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Profile Details */}
                {step === 2 && (
                    <div className="form-step">
                        <h2>Your Details</h2>

                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        {formData.role === 'hunter' && (
                            <>
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Primary Expertise *</label>
                                    <div className="tags">
                                        {EXPERTISE_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={`tag ${formData.expertise.includes(tag) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    const newExpertise = formData.expertise.includes(tag)
                                                        ? formData.expertise.filter(t => t !== tag)
                                                        : [...formData.expertise, tag];
                                                    setFormData({ ...formData, expertise: newExpertise });
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Bio (optional)</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}

                        {formData.role === 'payer' && (
                            <>
                                <div className="form-group">
                                    <label>Account Type</label>
                                    <div className="toggle-buttons">
                                        <button
                                            type="button"
                                            className={!formData.is_organization ? 'active' : ''}
                                            onClick={() => setFormData({ ...formData, is_organization: false })}
                                        >
                                            Individual
                                        </button>
                                        <button
                                            type="button"
                                            className={formData.is_organization ? 'active' : ''}
                                            onClick={() => setFormData({ ...formData, is_organization: true })}
                                        >
                                            Organization
                                        </button>
                                    </div>
                                </div>

                                {formData.is_organization && (
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Your company name"
                                            value={formData.company_name}
                                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* STEP 3: Covenant */}
                {step === 3 && (
                    <div className="form-step">
                        <h2>The Digital Blood Oath</h2>
                        <div className="covenant-text">
                            <p>
                                By entering the Arena, you sign the Blood Oath. You acknowledge that Stakes
                                are non-refundable entry fees for a Game of Skill.
                            </p>
                            <p>
                                You agree to the Digital Autopsy results by our AI Arbitrator. Payers are
                                contractually bound to fund the Vault 105% before deployment and must select
                                a winner if criteria are met.
                            </p>
                            <p>
                                All Mission PDFs are encrypted. War Room chat logs are ephemeral and purged
                                immediately upon mission completion—zero history is stored.
                            </p>
                        </div>
                        <div className="covenant-checkbox">
                            <input
                                type="checkbox"
                                id="covenant"
                                checked={formData.accepted_covenant}
                                onChange={e => setFormData({ ...formData, accepted_covenant: e.target.checked })}
                            />
                            <label htmlFor="covenant">
                                I sign the Covenant and accept all terms
                            </label>
                        </div>
                    </div>
                )}

                {/* ACTIONS - NO "Cancel & Sign Out" */}
                <div className="onboarding-actions">
                    {step > 1 && (
                        <button
                            className="btn-back"
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                        >
                            Back
                        </button>
                    )}
                    <button
                        className="btn-continue"
                        onClick={step === 3 ? handleComplete : () => setStep(step + 1)}
                        disabled={!isStepValid() || loading}
                    >
                        {loading ? 'Saving...' : step === 3 ? 'Complete Setup' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
