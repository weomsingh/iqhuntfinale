import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Arena() {
    const { currentUser } = useAuth();
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBounties();
    }, []);

    async function fetchBounties() {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBounties(data || []);
        } catch (error) {
            console.error('Error fetching bounties:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading bounties...</div>;
    }

    return (
        <div className="arena-page">
            <h1>Arena</h1>
            <p>Welcome, {currentUser?.username}!</p>

            {bounties.length === 0 ? (
                <div className="empty-state">
                    <p>No active bounties right now. Check back soon!</p>
                </div>
            ) : (
                <div className="bounties-grid">
                    {bounties.map(bounty => (
                        <div key={bounty.id} className="bounty-card">
                            <h3>{bounty.title}</h3>
                            <p className="reward">{bounty.currency === 'USD' ? '$' : '₹'}{bounty.reward}</p>
                            <button>View Details</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
