import { useState } from 'react';
import WalletCard from '../../components/wallet/WalletCard';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import WithdrawalModal from '../../components/wallet/WithdrawalModal';

const HunterVaultPage = () => {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <WithdrawalModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
            />

            <div>
                <h1 className="text-3xl font-bold text-white mb-2">The Vault</h1>
                <p className="text-iq-text-secondary">Manage your earnings and request payouts.</p>
            </div>

            <WalletCard
                showWithdraw={true}
                onWithdraw={() => setIsWithdrawModalOpen(true)}
            />

            <TransactionHistory />
        </div>
    );
};

export default HunterVaultPage;
