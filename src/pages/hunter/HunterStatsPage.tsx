
import { BarChart2 } from 'lucide-react';

const HunterStatsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="w-8 h-8 text-iq-green" />
                My Stats
            </h1>
            <div className="bg-iq-secondary/30 border border-iq-border rounded-xl p-8 text-center">
                <p className="text-iq-text-secondary">Detailed statistics coming soon.</p>
            </div>
        </div>
    );
};

export default HunterStatsPage;
