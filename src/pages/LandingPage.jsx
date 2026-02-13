import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target } from 'lucide-react';
import Footer from '../components/Footer';

export default function LandingPage() {
    const { currentUser, loading, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If user is logged in, redirect to their dashboard
        if (!loading && currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (currentUser.role === 'hunter') {
                navigate('/hunter/dashboard', { replace: true });
            } else {
                navigate('/payer/dashboard', { replace: true });
            }
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // If logged in, don't render (will redirect)
    if (currentUser) {
        return null;
    }

    async function handleEnterAsHunter() {
        try {
            await signInWithGoogle('hunter');
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }

    async function handlePostBounty() {
        try {
            await signInWithGoogle('payer');
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="logo">
                    <Target size={24} />
                    <span>IQHUNT</span>
                </div>
                <nav>
                    <a href="/covenant">The Covenant</a>
                    <a href="/contact">Contact</a>
                </nav>
                {/* NO DASHBOARD BUTTON - User is NOT logged in */}
            </header>

            <section className="hero">
                <h1>
                    WHERE SKILL<br />
                    <span className="highlight">HUNTS MONEY.</span>
                </h1>
                <p className="subtitle">A private competitive arena for skilled individuals.</p>
                <p className="tagline">Deploy capital. Stake your skill. Extract the reward.</p>

                <div className="hero-buttons">
                    <button className="btn-primary" onClick={handleEnterAsHunter}>
                        ENTER AS HUNTER →
                    </button>
                    <button className="btn-secondary" onClick={handlePostBounty}>
                        POST A BOUNTY (PAYER ONLY)
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
