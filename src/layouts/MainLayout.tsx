import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Target, Instagram } from 'lucide-react';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-iq-black text-iq-text font-sans selection:bg-iq-green selection:text-iq-black flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-50 bg-iq-black/80 backdrop-blur-md border-b border-iq-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Target className="w-6 h-6 text-iq-green group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-display font-bold text-xl tracking-tight">IQHUNT</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-iq-text-secondary">
                        <Link to="/covenant" className="hover:text-iq-green transition-colors">The Covenant</Link>
                        <button
                            onClick={() => {
                                if (window.location.pathname !== '/') {
                                    window.location.href = '/#how-it-works';
                                } else {
                                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="hover:text-iq-green transition-colors cursor-pointer bg-transparent border-none p-0 font-medium"
                        >
                            How It Works
                        </button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/signin" className="text-sm font-medium hover:text-iq-green transition-colors">Sign In</Link>
                        <Link to="/signin" className="px-4 py-2 bg-iq-green text-iq-black font-bold text-sm rounded hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all">
                            Enter Arena
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-16">
                <Outlet />
            </main>

            <footer className="border-t border-iq-border bg-iq-secondary/30 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-iq-green" />
                            <span className="font-display font-bold text-lg">IQHUNT</span>
                        </Link>
                        <p className="text-sm text-iq-text-secondary">
                            Where skill hunts money. <br />
                            The triangle of trust.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/iqhunt.arena?igsh=MW16d3RseXp6N3VreA==" target="_blank" rel="noopener noreferrer" className="text-iq-text-secondary hover:text-iq-green transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-iq-text-secondary">
                            {/* <li><Link to="/#pillars" className="hover:text-iq-green">Three Pillars</Link></li> */}
                            <li><Link to="/covenant" className="hover:text-iq-green">The Covenant</Link></li>
                            <li><Link to="/#how-it-works" className="hover:text-iq-green">How It Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-iq-text-secondary">
                            <li><Link to="/terms" className="hover:text-iq-green">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="hover:text-iq-green">Privacy Policy</Link></li>
                            <li><Link to="/contact" className="hover:text-iq-green">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-iq-text-secondary">
                            <li><a href="mailto:iqhuntarena@gmail.com" className="hover:text-iq-green">iqhuntarena@gmail.com</a></li>
                            <li><a href="tel:+918127893782" className="hover:text-iq-green">+91 8127893782</a></li>
                            <li>Prayagraj, India</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-iq-border px-6 py-6 text-center text-sm text-iq-text-secondary">
                    © 2026 IQHUNT. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
