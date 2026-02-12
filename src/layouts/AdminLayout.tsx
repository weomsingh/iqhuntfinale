import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Target, LayoutDashboard, ShieldCheck, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const { signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-iq-black flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col z-20">
                <Link to="/" className="flex items-center gap-2 mb-10 group">
                    <Target className="w-8 h-8 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-display font-bold text-2xl tracking-tight text-white">IQHUNT <span className="text-red-500 text-xs align-top">ADMIN</span></span>
                </Link>

                <nav className="space-y-2 flex-grow">
                    <Link
                        to="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/verify"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/verify')
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-medium">Verify Funds</span>
                    </Link>

                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Users</span>
                    </Link>
                </nav>

                <div className="pt-6 border-t border-zinc-800 space-y-2">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 min-h-screen flex flex-col bg-black">
                <header className="h-20 border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Sovereign Admin Panel</h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        God Mode Active
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
