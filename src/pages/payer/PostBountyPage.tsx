import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Calendar, Target, DollarSign, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

// Schema Validation
const bountySchema = z.object({
    title: z.string().min(10, 'Title must be at least 10 characters').max(100),
    category: z.enum(['Design', 'Development', 'Content', 'Data', 'Marketing', 'Other']),
    description: z.string().min(50, 'Description must be detailed (min 50 chars)'),
    requirements: z.array(
        z.object({
            value: z.string().min(5, 'Requirement needs to be specific')
        })
    ).min(1, 'Add at least one requirement'),
    reward: z.number().min(1000, 'Minimum reward is ₹1,000'),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Deadline must be in the future',
    }),
    slots: z.number().min(1).max(50),
});

type BountyFormValues = z.infer<typeof bountySchema>;

const PostBountyPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, control, handleSubmit, formState: { errors } } = useForm<BountyFormValues>({
        resolver: zodResolver(bountySchema),
        defaultValues: {
            category: 'Design',
            reward: 5000,
            slots: 12,
            requirements: [{ value: '' }, { value: '' }, { value: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "requirements"
    });

    const onSubmit = async (data: BountyFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Submitting Bounty:", data);
            // SIMULATING API CALL until backend is fully connected
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/payer/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to post bounty');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/payer/dashboard')}
                    className="p-2 rounded-lg bg-[#ffffff05] border border-[#ffffff1a] text-[#888] hover:text-white hover:border-iq-green/50 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Post a New Bounty</h1>
                    <p className="text-[#888]">Define the mission, set the reward, and recruit the best hunters.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Section 1: Basic Info */}
                <div className="bg-[#ffffff05] border border-[#ffffff1a] rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 border-b border-[#ffffff1a] pb-6 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green">
                            <Target className="w-4 h-4" />
                        </div>
                        Mission Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-[#888]">Bounty Title</label>
                            <input
                                {...register('title')}
                                placeholder="e.g. Redesign Fintech Mobile App Dashboard"
                                className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:border-iq-green outline-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                            />
                            {errors.title && <p className="text-red-500 text-xs font-medium mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#888]">Category</label>
                            <div className="relative">
                                <select
                                    {...register('category')}
                                    className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl px-5 py-4 text-white focus:border-iq-green outline-none appearance-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)] cursor-pointer"
                                >
                                    <option value="Design">Design</option>
                                    <option value="Development">Development</option>
                                    <option value="Content">Content</option>
                                    <option value="Data">Data</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                            {errors.category && <p className="text-red-500 text-xs font-medium mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#888]">Total Slots (Hunters)</label>
                            <input
                                type="number"
                                {...register('slots', { valueAsNumber: true })}
                                className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl px-5 py-4 text-white focus:border-iq-green outline-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                            />
                            {errors.slots && <p className="text-red-500 text-xs font-medium mt-1">{errors.slots.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-[#888]">Description</label>
                            <textarea
                                {...register('description')}
                                rows={6}
                                placeholder="Describe the task in detail. What are the goals? What is the expected outcome?"
                                className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:border-iq-green outline-none resize-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                            />
                            {errors.description && <p className="text-red-500 text-xs font-medium mt-1">{errors.description.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 2: Requirements */}
                <div className="bg-[#ffffff05] border border-[#ffffff1a] rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 border-b border-[#ffffff1a] pb-6 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green">
                            <Target className="w-4 h-4" />
                        </div>
                        Requirements & Deliverables
                    </h2>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 group">
                                <div className="flex-grow">
                                    <input
                                        {...register(`requirements.${index}.value` as const)}
                                        placeholder={`Requirement #${index + 1}`}
                                        className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:border-iq-green outline-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                                    />
                                    {errors.requirements?.[index]?.value && (
                                        <p className="text-red-500 text-xs font-medium mt-1">{errors.requirements[index]?.value?.message}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="px-4 text-[#666] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => append({ value: '' })}
                            className="text-sm font-bold text-iq-green hover:text-[#00ff9d] flex items-center gap-2 mt-4 px-2 py-1 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Another Requirement
                        </button>
                    </div>
                </div>

                {/* Section 3: Budget & Timeline */}
                <div className="bg-[#ffffff05] border border-[#ffffff1a] rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 border-b border-[#ffffff1a] pb-6 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        Budget & Timeline
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#888]">Reward Amount (INR)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666] font-bold">₹</span>
                                <input
                                    type="number"
                                    {...register('reward', { valueAsNumber: true })}
                                    className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl pl-10 pr-5 py-4 text-white focus:border-iq-green outline-none font-mono text-lg transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                                />
                            </div>
                            {errors.reward && <p className="text-red-500 text-xs font-medium mt-1">{errors.reward.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#888]">Submission Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                                <input
                                    type="datetime-local"
                                    {...register('deadline')}
                                    className="w-full bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl pl-12 pr-5 py-4 text-white focus:border-iq-green outline-none transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]" // Removed calendar-picker-indicator styling as it's browser specific, can add CSS later
                                />
                            </div>
                            {errors.deadline && <p className="text-red-500 text-xs font-medium mt-1">{errors.deadline.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 rounded-xl font-bold text-[#888] hover:text-white hover:bg-[#ffffff05] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-grow px-8 py-4 rounded-xl font-bold text-[#0a0a0a] bg-iq-green hover:bg-[#00ff9d] hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Bounty & Fund'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PostBountyPage;
