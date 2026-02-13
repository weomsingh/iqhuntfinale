import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import OnboardingPage from './pages/OnboardingPage';

// Hunter pages
import HunterLayout from './pages/hunter/HunterLayout';
import HunterArena from './pages/hunter/Arena';
import HunterDashboard from './pages/hunter/Dashboard';
import HunterVault from './pages/hunter/Vault';
import BountyDetails from './pages/hunter/BountyDetails';

// Payer pages
import PayerLayout from './pages/payer/PayerLayout';
import PayerDashboard from './pages/payer/Dashboard';
import PayerLiveBounties from './pages/payer/LiveBounties';
import PayerHistory from './pages/payer/History';
import PayerVault from './pages/payer/Vault';
import PostBounty from './pages/payer/PostBounty';

// Static pages
import Terms from './pages/static/Terms';
import Privacy from './pages/static/Privacy';
import Contact from './pages/static/Contact';
import Covenant from './pages/static/Covenant';

import './styles/App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/covenant" element={<Covenant />} />

                    {/* Hunter routes - PROTECTED */}
                    <Route
                        path="/hunter"
                        element={
                            <ProtectedRoute allowedRole="hunter">
                                <HunterLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/hunter/dashboard" replace />} />
                        <Route path="arena" element={<HunterArena />} />
                        <Route path="dashboard" element={<HunterDashboard />} />
                        <Route path="vault" element={<HunterVault />} />
                        <Route path="bounty/:id" element={<BountyDetails />} />
                    </Route>

                    {/* Payer routes - PROTECTED */}
                    <Route
                        path="/payer"
                        element={
                            <ProtectedRoute allowedRole="payer">
                                <PayerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/payer/dashboard" replace />} />
                        <Route path="dashboard" element={<PayerDashboard />} />
                        <Route path="post-bounty" element={<PostBounty />} />
                        <Route path="live-bounties" element={<PayerLiveBounties />} />
                        <Route path="history" element={<PayerHistory />} />
                        <Route path="vault" element={<PayerVault />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
