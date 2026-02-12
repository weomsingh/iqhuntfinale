import { useState } from 'react';
import { Search, Filter, Clock, Users, Eye, Target } from 'lucide-react';
import BountyDetailsModal from '../../components/hunter/BountyDetailsModal';

// Mock data until we connect to real DB
interface Bounty {
    id: string;
    title: string;
    reward: number;
    currency: string;
    deadline: string;
    slots: number;
    filled: number;
    views: number;
    category: string;
    description?: string;
    requirements?: string[];
}

const MOCK_BOUNTIES: Bounty[] = [
    {
        id: '1',
        title: 'Fintech Dashboard UI Design',
        reward: 15000,
        currency: 'INR',
        deadline: '2 days left',
        slots: 12,
        filled: 5,
        views: 124,
        category: 'Design',
        description: 'Design a futuristic, dark-mode fintech dashboard for high-frequency traders. Focus on data visualization, speed, and clarity. The design must be responsive and include a mobile version.',
        requirements: ['Figma Source File', 'Mobile Responsive Layouts', 'Dark Mode Only', 'Use Inter Font', 'Interactive Prototype']
    },
    {
        id: '2',
        title: 'React Component Library',
        reward: 8000,
        currency: 'INR',
        deadline: '5 hours left',
        slots: 12,
        filled: 11,
        views: 89,
        category: 'Development',
        description: 'Build a reusable component library using React, Tailwind CSS, and TypeScript. Must include Buttons, Inputs, Modals, and Cards with full accessibility support.',
        requirements: ['TypeScript Support', 'Tailwind CSS Styling', 'Storybook Documentation', 'Jest Unit Tests', 'Accessibility (A11y) Compliance']
    },
    {
        id: '3',
        title: 'SEO Content Strategy for SaaS',
        reward: 5000,
        currency: 'INR',
        deadline: '7 days left',
        slots: 12,
        filled: 2,
        views: 45,
        category: 'Content',
        description: 'Develop a comprehensive SEO content strategy for a B2B SaaS platform targeting enterprise clients. Includes keyword research, content calendar, and distribution plan.',
        requirements: ['Keyword Research Report', '3-Month Content Calendar', 'Competitor Analysis', 'Distribution Strategy']
    },
];

const ArenaPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);

    const filteredBounties = MOCK_BOUNTIES.filter(bounty => {
        const matchesSearch = bounty.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || bounty.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleStake = () => {
        alert(`Staking initiated for ${selectedBounty?.title}. Logic coming soon.`);
        setSelectedBounty(null);
    };

    return (
        <div className="space-y-8 relative">
            <div>
                <h1 className="text-3xl font-bold mb-2">The Arena</h1>
                <p className="text-iq-text-secondary">Where the hunt begins. Stake your claim.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-iq-secondary/30 rounded-xl border border-iq-border">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-iq-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search bounties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-iq-black border border-iq-border rounded-lg pl-10 pr-4 py-2 text-white focus:border-iq-green outline-none"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Design', 'Development', 'Content', 'Data'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-iq-green text-iq-black'
                                    : 'bg-iq-black border border-iq-border text-iq-text-secondary hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button className="px-4 py-2 bg-iq-black border border-iq-border rounded-lg text-iq-text-secondary hover:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Bounties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBounties.map((bounty) => (
                    <div key={bounty.id} className="group bg-iq-secondary/20 rounded-xl border border-iq-border hover:border-iq-green/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-iq-green/5 flex flex-col">
                        <div className="p-6 flex-grow space-y-4 cursor-pointer" onClick={() => setSelectedBounty(bounty)}>
                            <div className="flex justify-between items-start">
                                <span className="px-2 py-1 bg-iq-secondary rounded text-xs text-iq-text-secondary border border-iq-border">
                                    {bounty.category}
                                </span>
                                <span className="text-iq-green font-bold flex items-center gap-1">
                                    ₹{bounty.reward.toLocaleString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold group-hover:text-iq-green transition-colors">{bounty.title}</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm text-iq-text-secondary pt-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{bounty.deadline}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{bounty.filled}/{bounty.slots} Joined</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    <span>{bounty.views} views</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-iq-border bg-iq-secondary/10">
                            <button
                                onClick={() => setSelectedBounty(bounty)}
                                className="w-full py-3 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <Target className="w-4 h-4" />
                                Stake ₹10 to Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBounties.length === 0 && (
                <div className="text-center py-20 text-iq-text-secondary">
                    <p>No bounties found matching your search.</p>
                </div>
            )}

            {/* Modal Overlay */}
            {selectedBounty && (
                <BountyDetailsModal
                    bounty={selectedBounty}
                    onClose={() => setSelectedBounty(null)}
                    onStake={handleStake}
                />
            )}
        </div>
    );
};

export default ArenaPage;
