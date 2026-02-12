
import { Mail, MapPin, Phone, Instagram } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-12 text-iq-green text-center">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="p-6 bg-iq-secondary/30 rounded-xl border border-iq-border">
                        <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-iq-text-secondary mb-1">Email</p>
                                    <a href="mailto:iqhuntarena@gmail.com" className="text-white hover:text-iq-green transition-colors">iqhuntarena@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-iq-text-secondary mb-1">Phone</p>
                                    <a href="tel:+918127893782" className="text-white hover:text-iq-green transition-colors">+91 8127893782</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-iq-text-secondary mb-1">Location</p>
                                    <p className="text-white">Prayagraj, Uttar Pradesh, India</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-iq-green/10 flex items-center justify-center text-iq-green shrink-0">
                                    <Instagram className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-iq-text-secondary mb-1">Follow Us</p>
                                    <a href="https://www.instagram.com/iqhunt.arena?igsh=MW16d3RseXp6N3VreA==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-iq-green transition-colors">@iqhunt.arena</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-iq-secondary/30 rounded-xl border border-iq-border">
                        <h3 className="text-xl font-bold text-white mb-2">Support Hours</h3>
                        <p className="text-iq-text-secondary">Monday - Saturday<br />10:00 AM - 6:00 PM IST</p>
                        <p className="text-iq-text-secondary mt-4 text-sm">We typically respond within 24 hours.</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-iq-black/50 p-8 rounded-2xl border border-iq-border">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-iq-text-secondary">Name</label>
                                <input type="text" className="w-full bg-iq-secondary border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green focus:ring-1 focus:ring-iq-green outline-none transition-all" placeholder="Enter your name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-iq-text-secondary">Email</label>
                                <input type="email" className="w-full bg-iq-secondary border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green focus:ring-1 focus:ring-iq-green outline-none transition-all" placeholder="Enter your email" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-iq-text-secondary">Subject</label>
                            <select className="w-full bg-iq-secondary border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green focus:ring-1 focus:ring-iq-green outline-none transition-all">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Payment Issue</option>
                                <option>Report Abuse</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-iq-text-secondary">Message</label>
                            <textarea rows={5} className="w-full bg-iq-secondary border border-iq-border rounded-lg px-4 py-3 text-white focus:border-iq-green focus:ring-1 focus:ring-iq-green outline-none transition-all" placeholder="How can we help you?" />
                        </div>

                        <button type="submit" className="w-full py-4 bg-iq-green text-iq-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
