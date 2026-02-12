

const TermsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-8 text-iq-green">Terms & Conditions</h1>
            <div className="space-y-6 text-iq-text-secondary">
                <p className="text-sm">Last Updated: February 2026</p>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing IQHUNT, you agree to these Terms & Conditions. If you do not agree, do not use the platform.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must be 18 years or older.</li>
                        <li>You must provide accurate information during registration.</li>
                        <li>One account per person is permitted.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                    <h3 className="text-xl font-bold text-white mb-2">For Hunters:</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Submit original work only.</li>
                        <li>Meet all deadlines.</li>
                        <li>Follow instruction manuals precisely.</li>
                        <li>No plagiarism or copyright infringement.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mb-2">For Payers:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide clear, measurable requirements.</li>
                        <li>Pre-fund bounties before posting.</li>
                        <li>Select a winner if criteria are met.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Stakes & Payments</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All stakes are non-refundable entry fees.</li>
                        <li>Payments processed via UPI.</li>
                        <li>2% administrative fee on withdrawals.</li>
                        <li>300-second settlement target (actual time may vary).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Refund Policy</h2>
                    <p>Stakes are non-refundable except for:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Payer cancels before any hunter joins.</li>
                        <li>Platform technical failure.</li>
                        <li>Top 20% runners-up (30% refund as credits).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
                    <p>For questions: <a href="mailto:iqhuntarena@gmail.com" className="text-iq-green hover:underline">iqhuntarena@gmail.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default TermsPage;
