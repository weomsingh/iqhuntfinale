import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Alphanumeric only'),
    nationality: z.enum(['india', 'global']),
    // Hunter specific
    expertise: z.array(z.string()).optional(),
    bio: z.string().max(500).optional(),
    portfolio_url: z.string().url().optional().or(z.literal('')),
    // Payer specific
    company_name: z.string().optional(),
    is_organization: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EXPERTISE_OPTIONS = [
    'UI/UX Design', 'Frontend Dev', 'Backend Dev', 'Mobile App',
    'Content Writing', 'Video Editing', 'Data Analysis', 'Graphic Design'
];

const ProfileCompletionPage = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') as 'hunter' | 'payer';
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nationality: 'india',
            is_organization: false,
            expertise: []
        }
    });

    const selectedExpertise = watch('expertise') || [];

    const toggleExpertise = (tech: string) => {
        if (selectedExpertise.includes(tech)) {
            setValue('expertise', selectedExpertise.filter(t => t !== tech));
        } else {
            if (selectedExpertise.length < 5) {
                setValue('expertise', [...selectedExpertise, tech]);
            }
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;
        setLoading(true);
        setError(null);

        const currency = data.nationality === 'india' ? 'INR' : 'USD';

        try {
            const { error: insertError } = await supabase.from('profiles').insert({
                id: user.id,
                email: user.email!,
                role: role,
                username: data.username,
                nationality: data.nationality,
                currency: currency,
                // Hunter fields
                expertise: role === 'hunter' ? data.expertise : null,
                bio: role === 'hunter' ? data.bio : null,
                portfolio_url: role === 'hunter' ? data.portfolio_url : null,
                // Payer fields
                company_name: role === 'payer' ? data.company_name : null,
                is_organization: role === 'payer' ? data.is_organization : false,
            });

            if (insertError) throw insertError;

            // Navigate to Covenant
            navigate('/onboarding/covenant');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create profile');
        } finally {
            setLoading(false);
        }
    };

    if (!role) return <div>Invalid role</div>;

    return (
        <div className="min-h-screen bg-iq-black flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-iq-secondary/30 backdrop-blur-md border border-iq-border rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                <p className="text-iq-text-secondary mb-8">
                    {role === 'hunter' ? 'Tell us about your skills.' : 'Tell us about your organization.'}
                </p>

                {error && <div className="mb-4 text-red-500">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-iq-text-secondary">Username</label>
                            <input
                                {...register('username')}
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none"
                                placeholder="Unique handle"
                            />
                            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-iq-text-secondary">Nationality</label>
                            <select
                                {...register('nationality')}
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none"
                            >
                                <option value="india">India (INR)</option>
                                <option value="global">Global (USD)</option>
                            </select>
                        </div>
                    </div>

                    {role === 'hunter' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-iq-text-secondary">Primary Expertise (Max 5)</label>
                                <div className="flex flex-wrap gap-2">
                                    {EXPERTISE_OPTIONS.map(tech => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => toggleExpertise(tech)}
                                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedExpertise.includes(tech)
                                                ? 'bg-iq-green/20 border-iq-green text-iq-green'
                                                : 'bg-iq-black border-iq-border text-iq-text-secondary hover:border-iq-text-secondary'
                                                }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-iq-text-secondary">Bio</label>
                                <textarea
                                    {...register('bio')}
                                    rows={3}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none"
                                    placeholder="Short bio..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-iq-text-secondary">Portfolio URL (Optional)</label>
                                <input
                                    {...register('portfolio_url')}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none"
                                    placeholder="https://..."
                                />
                                {errors.portfolio_url && <p className="text-red-500 text-xs">{errors.portfolio_url.message}</p>}
                            </div>
                        </>
                    )}

                    {role === 'payer' && (
                        <>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('is_organization')}
                                    className="rounded bg-iq-black border-iq-border text-iq-green focus:ring-iq-green"
                                />
                                <label className="text-sm font-medium text-iq-text-secondary">I represent an organization</label>
                            </div>

                            {watch('is_organization') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-iq-text-secondary">Company Name</label>
                                    <input
                                        {...register('company_name')}
                                        className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileCompletionPage;
