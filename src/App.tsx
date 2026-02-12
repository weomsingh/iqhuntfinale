import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HunterLayout from './layouts/HunterLayout';
import PayerLayout from './layouts/PayerLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import TermsPage from './pages/TermsPage';
import SignInPage from './pages/auth/SignInPage';
import CompleteProfilePage from './pages/auth/CompleteProfilePage';
import CovenantPage from './pages/CovenantPage';

import HunterDashboard from './pages/hunter/HunterDashboard';
import ArenaPage from './pages/hunter/ArenaPage'; // Corrected import
import BountyDetailsPage from './pages/hunter/BountyDetailsPage';
import WarRoomPage from './pages/hunter/WarRoomPage';
import HunterVaultPage from './pages/hunter/HunterVaultPage';

import PayerDashboard from './pages/payer/PayerDashboard';
import PostBountyPage from './pages/payer/PostBountyPage';
import MyBountiesPage from './pages/payer/MyBountiesPage';
import BountyManagementPage from './pages/payer/BountyManagementPage';
import PayerWalletPage from './pages/payer/PayerWalletPage';
import PayerSettingsPage from './pages/payer/PayerSettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyFundsPage from './pages/admin/VerifyFundsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<TermsPage />} />
            <Route path="covenant" element={<CovenantPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="complete-profile" element={<CompleteProfilePage />} />
          </Route>

          <Route path="/hunter" element={
            <RequireAuth allowedRole="hunter">
              <HunterLayout />
            </RequireAuth>
          }>
            <Route path="dashboard" element={<HunterDashboard />} />
            <Route path="arena" element={<ArenaPage />} />
            <Route path="bounty/:id" element={<BountyDetailsPage />} />
            <Route path="war-room/:id" element={<WarRoomPage />} />
            <Route path="vault" element={<HunterVaultPage />} />
          </Route>

          <Route path="/payer" element={
            <RequireAuth allowedRole="payer">
              <PayerLayout />
            </RequireAuth>
          }>
            <Route path="dashboard" element={<PayerDashboard />} />
            <Route path="post-bounty" element={<PostBountyPage />} />
            <Route path="bounties" element={<MyBountiesPage />} />
            <Route path="bounty/:id" element={<BountyManagementPage />} />
            <Route path="wallet" element={<PayerWalletPage />} />
            <Route path="settings" element={<PayerSettingsPage />} />
          </Route>

          <Route path="/admin" element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verify" element={<VerifyFundsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
