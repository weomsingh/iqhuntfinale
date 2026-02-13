import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function HunterLayout() {
    return (
        <div className="dashboard-layout">
            <Header />
            <Sidebar role="hunter" />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
