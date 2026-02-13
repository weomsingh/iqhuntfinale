import { Link } from 'react-router-dom';
import { Target, Mail, Twitter, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-brand">
                        <Target size={24} />
                        <span className="footer-logo">IQHUNT</span>
                    </div>
                    <p className="footer-tagline">
                        Where skill hunts money. A sovereign, skill-based competitive platform.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Platform</h4>
                    <ul className="footer-links">
                        <li><Link to="/covenant">The Covenant</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <ul className="footer-links">
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><a href="mailto:iqhuntarena@gmail.com">Email Support</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="footer-social">
                        <a href="mailto:iqhuntarena@gmail.com" className="social-link" aria-label="Email">
                            <Mail size={20} />
                        </a>
                        {/* Add more social links as needed */}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} IQHUNT. All rights reserved.</p>
                <p className="footer-disclaimer">
                    This is a skill-based competitive platform. Participate responsibly.
                </p>
            </div>
        </footer>
    );
}
