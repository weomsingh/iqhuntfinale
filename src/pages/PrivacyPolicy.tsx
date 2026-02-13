
import { Shield, Lock, Eye, Server, RefreshCw, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-iq-black min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-20" />

            <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-iq-secondary border border-iq-border rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-500">
                        <Lock className="w-8 h-8 text-iq-green" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Protocol</h1>
                    <p className="text-iq-text-secondary text-lg max-w-2xl mx-auto">
                        We collect minimal data. We protect it fiercely. We never sell it.
                        <br />
                        This is the IQHUNT standard.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Data Collection */}
                    <section className="bg-iq-secondary/30 border border-iq-border rounded-2xl p-8 hover:border-iq-green/30 transition-colors group">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-iq-green" />
                            1. Data We Collect
                        </h2>
                        <ul className="space-y-4 text-iq-text-secondary">
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-iq-green mt-2.5 flex-shrink-0" />
                                <span><strong>Identity:</strong> Username, email address (for authentication only).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-iq-green mt-2.5 flex-shrink-0" />
                                <span><strong>Financial:</strong> Wallet balance, transaction history (stored securely). We do <span className="text-white">not</span> store credit card numbers.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-iq-green mt-2.5 flex-shrink-0" />
                                <span><strong>Usage:</strong> Bounty submissions, completion rates, and platform interactions.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Data Usage */}
                    <section className="bg-iq-secondary/30 border border-iq-border rounded-2xl p-8 hover:border-iq-green/30 transition-colors group">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Server className="w-6 h-6 text-iq-green" />
                            2. How We Use It
                        </h2>
                        <p className="text-iq-text-secondary leading-relaxed mb-4">
                            Your data drives the platform's core functionality:
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4">
                            <li className="bg-iq-black/50 p-4 rounded-lg border border-iq-border">
                                <h3 className="text-white font-bold mb-1">Matchmaking</h3>
                                <p className="text-sm text-iq-text-secondary">Connecting Hunters with relevant Bounties.</p>
                            </li>
                            <li className="bg-iq-black/50 p-4 rounded-lg border border-iq-border">
                                <h3 className="text-white font-bold mb-1">Settlement</h3>
                                <p className="text-sm text-iq-text-secondary">Processing secure payments and stake releases.</p>
                            </li>
                            <li className="bg-iq-black/50 p-4 rounded-lg border border-iq-border">
                                <h3 className="text-white font-bold mb-1">Security</h3>
                                <p className="text-sm text-iq-text-secondary">Detecting fraud, bots, and covenant violations.</p>
                            </li>
                            <li className="bg-iq-black/50 p-4 rounded-lg border border-iq-border">
                                <h3 className="text-white font-bold mb-1">Communication</h3>
                                <p className="text-sm text-iq-text-secondary">Sending critical updates about your bounties.</p>
                            </li>
                        </ul>
                    </section>

                    {/* Data Protection */}
                    <section className="bg-iq-secondary/30 border border-iq-border rounded-2xl p-8 hover:border-iq-green/30 transition-colors group">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-iq-green" />
                            3. Protection & Sharing
                        </h2>
                        <div className="space-y-4 text-iq-text-secondary">
                            <p>
                                We employ industry-standard encryption for data in transit and at rest.
                                Access to personal data is strictly limited to authorized personnel.
                            </p>
                            <p className="p-4 bg-iq-green/5 border border-iq-green/20 rounded-lg text-white">
                                <strong>Zero-Sale Policy:</strong> We do not sell, rent, or trade your personal information to third parties. Ever.
                            </p>
                        </div>
                    </section>

                    {/* Updates */}
                    <section className="bg-iq-secondary/30 border border-iq-border rounded-2xl p-8 hover:border-iq-green/30 transition-colors group">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <RefreshCw className="w-6 h-6 text-iq-green" />
                            4. Updates to Policy
                        </h2>
                        <p className="text-iq-text-secondary">
                            The Protocol evolves. We may update this policy to reflect changes in our practices or legal requirements.
                            Significant changes will be communicated directly via email or platform notification.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="text-center pt-8 border-t border-iq-border">
                        <p className="text-iq-text-secondary mb-4">Questions about your privacy?</p>
                        <a
                            href="mailto:privacy@iqhunt.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Privacy Team
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
