import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth();
    const [status, setStatus] = useState('Checking session...');

    useEffect(() => {
        // If AuthContext is still loading, wait.
        if (authLoading) return;

        // If AuthContext already found the user, we can proceed directly!
        if (currentUser) {
            handleUserRouting(currentUser);
        } else {
            // If AuthContext finished but found no user, double check with getSession
            // incase of race conditions or initial-session delay.
            handleManualCheck();
        }
    }, [currentUser, authLoading]);

    async function handleManualCheck() {
        try {
            setStatus('Finalizing login...');
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (!session) {
                console.warn("No session found in callback, redirecting home.");
                navigate('/', { replace: true });
                return;
            }

            // If session exists, fetch profile manually since AuthContext might have missed it
            // or is in the process of updating.
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
            }

            if (profile) {
                handleUserRouting(profile);
            } else {
                // New user
                navigate('/onboarding', { replace: true });
            }

        } catch (err) {
            console.error('Manual callback check failed:', err);
            // Don't show error immediately, just redirect home
            navigate('/', { replace: true });
        }
    }

    function handleUserRouting(profile) {
        setStatus('Redirecting...');
        const intendedRole = localStorage.getItem('intended_role') || 'hunter';

        // Admin override
        if (profile.role === 'admin') {
            localStorage.removeItem('intended_role');
            navigate('/admin/dashboard', { replace: true });
            return;
        }

        // Role mismatch check (only if profile exists and has role)
        if (profile.role && profile.role !== intendedRole) {
            alert(
                `Account exists as ${profile.role}.\n` +
                `Please login with the correct role.`
            );
            navigate('/', { replace: true });
            return;
        }

        // Onboarding check
        if (!profile.username || !profile.accepted_covenant) {
            navigate('/onboarding', { replace: true });
            return;
        }

        // Success redirect
        localStorage.removeItem('intended_role');
        if (profile.role === 'hunter') {
            navigate('/hunter/dashboard', { replace: true });
        } else {
            navigate('/payer/dashboard', { replace: true });
        }
    }

    return (
        <LoadingScreen message={status} />
    );
}
