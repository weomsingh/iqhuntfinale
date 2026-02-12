

const PrivacyPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-8 text-iq-green">Privacy Policy</h1>
            <div className="space-y-6 text-iq-text-secondary">
                <p className="text-sm">Last Updated: February 2026</p>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Data We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> Email address, username, nationality, role.</li>
                        <li><strong>Financial Data:</strong> Wallet balance, transaction history, UPI IDs.</li>
                        <li><strong>Usage Data:</strong> Bounties viewed, joined, submitted. War Room chats (deleted after bounty ends).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">How We Use Data</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To provide platform services.</li>
                        <li>To process payments and prevent fraud.</li>
                        <li>To send important notifications.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Data Sharing</h2>
                    <p>We do NOT share your data with third parties except for:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Infrastructure providers (Supabase).</li>
                        <li>Payment processors.</li>
                        <li>Legal compliance.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All data encrypted in transit (HTTPS).</li>
                        <li>Database encrypted at rest.</li>
                        <li>War Room chats permanently deleted after bounty completion.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
                    <p>Privacy questions: <a href="mailto:iqhuntarena@gmail.com" className="text-iq-green hover:underline">iqhuntarena@gmail.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
