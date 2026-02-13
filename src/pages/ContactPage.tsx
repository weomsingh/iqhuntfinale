
import { Mail, MessageSquare, MapPin, Send, Phone } from 'lucide-react';
import { useState } from 'react';

const ContactPage = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="bg-iq-black min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-iq-green/5 via-transparent to-transparent opacity-20" />

            <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 lg:gap-24 animate-fade-in">

                {/* Information Section */}
                <div className="space-y-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Let's Talk.</h1>
                        <p className="text-xl text-iq-text-secondary leading-relaxed">
                            Have questions about the Protocol? Found a bug?
                            Need help with a dispute? We are listening.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Email */}
                        <div className="flex items-start gap-6 group">
                            <div className="w-12 h-12 bg-iq-secondary border border-iq-border rounded-xl flex items-center justify-center group-hover:border-iq-green/50 transition-colors shrink-0">
                                <Mail className="w-6 h-6 text-iq-green" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Email Support</h3>
                                <p className="text-iq-text-secondary mb-2">For general inquiries and partnerships.</p>
                                <a href="mailto:iqhuntarena@gmail.com" className="text-iq-green font-mono hover:underline">iqhuntarena@gmail.com</a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-6 group">
                            <div className="w-12 h-12 bg-iq-secondary border border-iq-border rounded-xl flex items-center justify-center group-hover:border-iq-green/50 transition-colors shrink-0">
                                <Phone className="w-6 h-6 text-iq-green" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Direct Line</h3>
                                <p className="text-iq-text-secondary mb-2">Urgent disputes or verification issues.</p>
                                <a href="tel:+918127893782" className="text-iq-green font-mono hover:underline">+91 8127893782</a>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-6 group">
                            <div className="w-12 h-12 bg-iq-secondary border border-iq-border rounded-xl flex items-center justify-center group-hover:border-iq-green/50 transition-colors shrink-0">
                                <MapPin className="w-6 h-6 text-iq-green" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">HQ</h3>
                                <p className="text-iq-text-secondary">
                                    Prayagraj, India<br />
                                    <span className="text-sm opacity-60">Operating globally.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-iq-secondary/30 backdrop-blur-sm border border-iq-border rounded-3xl p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-iq-green" />
                        Send a Message
                    </h2>

                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-iq-green/10 rounded-full flex items-center justify-center mb-6">
                                <Send className="w-8 h-8 text-iq-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-iq-text-secondary">We'll get back to you within 24 hours.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-iq-green hover:underline font-bold"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-iq-text-secondary">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-iq-text-secondary">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-iq-text-secondary">Subject</label>
                                <select className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors appearance-none cursor-pointer">
                                    <option>General Inquiry</option>
                                    <option>Report a Bug</option>
                                    <option>Dispute Resolution</option>
                                    <option>Partnership</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-iq-text-secondary">Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full bg-iq-black border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green outline-none transition-colors resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-4 bg-iq-green text-iq-black font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {status === 'sending' ? (
                                    <>Sending...</>
                                ) : (
                                    <>Send Message <Send className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
