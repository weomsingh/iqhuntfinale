import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        handleCallback();
    }, []);

    async function handleCallback() {
        try {
            // Get session from URL
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            if (!session) {
                navigate('/', { replace: true });
                return;
            }

            const { user } = session;
            const intendedRole = localStorage.getItem('intended_role') || 'hunter';

            // Check if profile exists
            const { data: existingProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                // Error other than "not found"
                throw profileError;
            }

            if (existingProfile) {
                // USER ALREADY HAS PROFILE

                // Check if trying to register with different role
                if (existingProfile.role !== intendedRole) {
                    alert(
                        `This email is already registered as a ${existingProfile.role}.\n\n` +
                        `Please use a different email to register as a ${intendedRole}.`
                    );
                    await supabase.auth.signOut();
                    localStorage.removeItem('intended_role');
                    navigate('/', { replace: true });
                    return;
                }

                // Check if onboarding complete
                if (!existingProfile.username || !existingProfile.accepted_covenant) {
                    // Resume onboarding
                    navigate('/onboarding', { replace: true });
                    return;
                }

                // All good - go to dashboard
                localStorage.removeItem('intended_role');
                if (existingProfile.role === 'hunter') {
                    navigate('/hunter/dashboard', { replace: true });
                } else {
                    navigate('/payer/dashboard', { replace: true });
                }

            } else {
                // NEW USER - Start onboarding
                navigate('/onboarding', { replace: true });
            }

        } catch (err) {
            console.error('Callback error:', err);
            setError('Login failed. Please try again.');
            setTimeout(() => navigate('/', { replace: true }), 3000);
        }
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0a0a0a',
                color: '#ff5252',
                textAlign: 'center',
            }}>
                <div>
                    <p>{error}</p>
                    <p style={{ color: '#888', marginTop: '10px' }}>Redirecting...</p>
                </div>
            </div>
        );
    }

    return <LoadingScreen />;
}
