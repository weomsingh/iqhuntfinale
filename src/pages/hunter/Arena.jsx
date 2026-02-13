import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import BountyCard from '../../components/BountyCard';
import { Search, Filter, RefreshCw } from 'lucide-react';

export default function Arena() {
    const { currentUser } = useAuth();
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterExpertise, setFilterExpertise] = useState('all');

    useEffect(() => {
        loadBounties();
    }, []);

    async function loadBounties() {
        setLoading(true);
        try {
            // Fetch live bounties
            const { data, error } = await supabase
                .from('bounties')
                .select(`
                    *,
                    payer:profiles!bounties_payer_id_fkey(username, company_name),
                    stakes:hunter_stakes(count)
                `)
                .eq('status', 'live')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Add staked_count to each bounty
            const bountiesWithCount = data.map(bounty => ({
                ...bounty,
                staked_count: bounty.stakes?.[0]?.count || 0
            }));

            setBounties(bountiesWithCount);
        } catch (error) {
            console.error('Error loading bounties:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredBounties = bounties.filter(bounty => {
        const matchesSearch = bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="arena-page">
            <div className="page-header">
                <div>
                    <h1>The Arena</h1>
                    <p className="page-subtitle">
                        Welcome, {currentUser?.username}! Browse live bounties and stake to compete.
                    </p>
                </div>
                <button className="btn-refresh" onClick={loadBounties} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    Refresh
                </button>
            </div>

            <div className="arena-controls">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search bounties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading bounties...</p>
                </div>
            ) : filteredBounties.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h3>No Active Bounties</h3>
                    <p>Check back soon for new opportunities!</p>
                </div>
            ) : (
                <div className="bounties-grid">
                    {filteredBounties.map(bounty => (
                        <BountyCard key={bounty.id} bounty={bounty} userRole="hunter" />
                    ))}
                </div>
            )}
        </div>
    );
}
