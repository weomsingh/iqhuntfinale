import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Calendar, Target, DollarSign, AlertCircle, Loader2 } from 'lucide-react';

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
    slots: z.number().min(1).max(50), // Removed .default(), handled in useForm
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
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay

            navigate('/payer/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to post bounty');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Post a New Bounty</h1>
                <p className="text-iq-text-secondary">Define the mission, set the reward, and recruit the best hunters.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">

                {/* Section 1: Basic Info */}
                <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-iq-border pb-4">
                        <Target className="w-5 h-5 text-blue-400" />
                        Mission Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Bounty Title</label>
                            <input
                                {...register('title')}
                                placeholder="e.g. Redesign Fintech Mobile App Dashboard"
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                            />
                            {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Category</label>
                            <select
                                {...register('category')}
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="Design">Design</option>
                                <option value="Development">Development</option>
                                <option value="Content">Content</option>
                                <option value="Data">Data</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && <p className="text-red-400 text-xs">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Total Slots (Hunters)</label>
                            <input
                                type="number"
                                {...register('slots', { valueAsNumber: true })}
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                            />
                            {errors.slots && <p className="text-red-400 text-xs">{errors.slots.message}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Description</label>
                            <textarea
                                {...register('description')}
                                rows={5}
                                placeholder="Describe the task in detail. What are the goals? What is the expected outcome?"
                                className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                            />
                            {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 2: Requirements */}
                <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-iq-border pb-4">
                        <Target className="w-5 h-5 text-blue-400" />
                        Requirements & Deliverables
                    </h2>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3">
                                <div className="flex-grow">
                                    <input
                                        {...register(`requirements.${index}.value` as const)}
                                        placeholder={`Requirement #${index + 1}`}
                                        className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    />
                                    {errors.requirements?.[index]?.value && (
                                        <p className="text-red-400 text-xs mt-1">{errors.requirements[index]?.value?.message}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-3 text-iq-text-secondary hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => append({ value: '' })}
                            className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 mt-2"
                        >
                            <Plus className="w-4 h-4" /> Add Requirement
                        </button>
                        {errors.requirements && <p className="text-red-400 text-xs">{errors.requirements.message}</p>}
                    </div>
                </div>

                {/* Section 3: Budget & Timeline */}
                <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-iq-border pb-4">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Budget & Timeline
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Reward Amount (INR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-iq-text-secondary font-bold">₹</span>
                                <input
                                    type="number"
                                    {...register('reward', { valueAsNumber: true })}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg pl-8 pr-4 py-3 text-white focus:border-green-400 outline-none font-mono text-lg"
                                />
                            </div>
                            {errors.reward && <p className="text-red-400 text-xs">{errors.reward.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-iq-text-secondary">Submission Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-iq-text-secondary" />
                                <input
                                    type="datetime-local"
                                    {...register('deadline')}
                                    className="w-full bg-iq-black border border-iq-border rounded-lg pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            {errors.deadline && <p className="text-red-400 text-xs">{errors.deadline.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 rounded-xl font-bold text-iq-text-secondary bg-iq-secondary/30 hover:bg-white/5 border border-iq-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-grow px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Bounty & Fund'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PostBountyPage;
