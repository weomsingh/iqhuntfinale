

const CovenantPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-red-600 via-iq-green to-red-600 bg-clip-text text-transparent">THE DIGITAL BLOOD OATH</h1>

            <div className="prose prose-invert max-w-none w-full bg-iq-secondary/50 p-8 rounded-2xl border border-iq-border space-y-8">
                <div className="flex gap-4">
                    <span className="text-3xl font-mono text-iq-green font-bold">01</span>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">STAKES ARE NON-REFUNDABLE</h3>
                        <p className="text-iq-text-secondary">All entry stakes are non-refundable fees for participating in a game of skill. Payment of a stake guarantees entry into competition, not victory or refund.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <span className="text-3xl font-mono text-iq-green font-bold">02</span>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">PRE-FUNDED CAPITAL GUARANTEE</h3>
                        <p className="text-iq-text-secondary">Payers must lock 105% of the bounty reward before deployment. Funds are held in escrow and cannot be withdrawn once the hunt begins.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <span className="text-3xl font-mono text-iq-green font-bold">03</span>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">SKILL-BASED COMPETITION</h3>
                        <p className="text-iq-text-secondary">This is a competitive meritocracy, not gambling. Winners are selected based on quality of work, not chance. The AI Arbitrator validates technical compliance; final selection is human.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <span className="text-3xl font-mono text-iq-green font-bold">04</span>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">INSTANT SETTLEMENT PROTOCOL</h3>
                        <p className="text-iq-text-secondary">Winners receive funds within 300 seconds of selection. Delays beyond our control (bank processing) may apply.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <span className="text-3xl font-mono text-iq-green font-bold">05</span>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">DATA PRIVACY</h3>
                        <p className="text-iq-text-secondary">All mission PDFs are encrypted in transit and at rest. War Room chat logs are ephemeral and permanently deleted upon completion. We do not sell or share your data with third parties.</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-iq-text-secondary mb-4">By entering the arena, you accept these terms.</p>
                <div className="inline-block px-4 py-2 border border-red-500/30 bg-red-500/10 rounded text-red-400 font-mono text-sm">
                    PROTOCOL: VERIFIED
                </div>
            </div>
        </div>
    );
};

export default CovenantPage;
