import { useState } from 'react';
import WalletCard from '../../components/wallet/WalletCard';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import DepositModal from '../../components/wallet/DepositModal';

const PayerWalletPage = () => {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />

            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Wallet & Funding</h1>
                <p className="text-iq-text-secondary">Securely fund your bounties and track expenses.</p>
            </div>

            <WalletCard
                showDeposit={true}
                onDeposit={() => setIsDepositModalOpen(true)}
            />

            <TransactionHistory />
        </div>
    );
};

export default PayerWalletPage;
