
import { Settings } from 'lucide-react';

const PayerSettingsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                <Settings className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-iq-text-secondary">Manage your organization profile and notification preferences.</p>
        </div>
    );
};

export default PayerSettingsPage;
