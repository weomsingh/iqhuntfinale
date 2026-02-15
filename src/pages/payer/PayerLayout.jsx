import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BottomNav from '../../components/BottomNav';

export default function PayerLayout() {
    return (
        <div className="dashboard-layout">
            <Header />
            <Sidebar role="payer" />
            <BottomNav role="payer" />
            <main className="main-content">
                <Outlet />
                <Footer />
            </main>
        </div>
    );
}
