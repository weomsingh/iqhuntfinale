import { useParams } from 'react-router-dom';

const BountyDetailsPage = () => {
    const { id } = useParams();
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Bounty Details: {id}</h1>
            <p className="text-iq-text-secondary">Detailed view of the bounty mission.</p>
        </div>
    );
};

export default BountyDetailsPage;
