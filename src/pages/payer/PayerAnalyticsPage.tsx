import { BarChart2 } from 'lucide-react';

const PayerAnalyticsPage = () => {
    return (
        <div className="animate-fade-in p-8 flex flex-col items-center justify-center h-[50vh] text-center border border-[#ffffff1a] rounded-2xl bg-[#ffffff05]">
            <div className="w-16 h-16 rounded-full bg-iq-green/10 flex items-center justify-center text-iq-green mb-6">
                <BarChart2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h1>
            <p className="text-[#888] max-w-md">Deep dive into your bounty performance, hunter engagement, and spending efficiency. This feature is coming soon.</p>
        </div>
    );
};

export default PayerAnalyticsPage;
