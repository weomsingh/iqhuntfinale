import { FileText } from 'lucide-react';

const PayerHistoryPage = () => {
    return (
        <div className="animate-fade-in p-8 flex flex-col items-center justify-center h-[50vh] text-center border border-[#ffffff1a] rounded-2xl bg-[#ffffff05]">
            <div className="w-16 h-16 rounded-full bg-iq-green/10 flex items-center justify-center text-iq-green mb-6">
                <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Transaction History</h1>
            <p className="text-[#888] max-w-md">View your past bounties, payments, and invoices. This feature is coming soon.</p>
        </div>
    );
};

export default PayerHistoryPage;
