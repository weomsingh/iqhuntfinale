import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // CRITICAL: Always set loading to false after max 3 seconds
        const loadingTimeout = setTimeout(() => {
            console.log('⚠️ Loading timeout - forcing loading=false');
            setLoading(false);
        }, 3000);

        // Check for existing session on mount
        checkSession().finally(() => {
            clearTimeout(loadingTimeout);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setCurrentUser(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
            clearTimeout(loadingTimeout);
        };
    }, []);

    async function checkSession() {
        try {
            console.log('🔍 Checking session...');
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session error:', error);
                setLoading(false);
                return;
            }

            if (session?.user) {
                console.log('✅ Session found, fetching profile...');
                await fetchProfile(session.user.id);
            } else {
                console.log('ℹ️ No active session');
            }
        } catch (error) {
            console.error('Session check error:', error);
        } finally {
            console.log('✅ Session check complete, setting loading=false');
            setLoading(false);
        }
    }

    async function fetchProfile(userId, retryCount = 0) {
        try {
            console.log(`Fetching profile for: ${userId} (Attempt ${retryCount + 1})`);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Profile fetch error:', error);

                // If profile specifically doesn't exist, user needs onboarding
                if (error.code === 'PGRST116') {
                    console.log('No profile found - user needs onboarding');
                    setCurrentUser(null);
                    return;
                }

                // For other errors (network, timeout), retry a few times before giving up
                if (retryCount < 3) {
                    console.log(`Retrying profile fetch in 1s...`);
                    setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
                    return;
                }

                // If we exhausted retries, keep the previous user state if possible or show error
                // Do NOT set currentUser to null effectively logging them out unless we are sure.
                console.error('Failed to fetch profile after retries.');
                // We do NOT set currentUser(null) here to avoid "flashing" logout state on flaky connection.
                // However, if it's the initial load, we might be stuck in loading state.
                // Best to keep loading=false but maybe show a toast.
                return;
            }

            console.log('✅ Profile loaded:', data.username);
            setCurrentUser(data);
        } catch (error) {
            console.error('Profile fetch exception:', error);
            // Don't logout immediately on random exceptions
        }
    }

    async function signInWithGoogle(intendedRole) {
        // Save intended role BEFORE OAuth redirect
        localStorage.setItem('intended_role', intendedRole);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('OAuth error:', error);
            throw error;
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
        setCurrentUser(null);
        localStorage.removeItem('intended_role');
        window.location.href = '/';
    }

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        signOut,
        refetchProfile: () => currentUser && fetchProfile(currentUser.id),
        refreshUser: () => currentUser && fetchProfile(currentUser.id), // Alias
    };

    // Show loading screen only for first 3 seconds max
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#0a0a0a',
                color: '#00ff9d',
                fontSize: '1.5rem',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div className="spinner"></div>
                <div>Loading...</div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
