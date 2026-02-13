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

    async function fetchProfile(userId) {
        try {
            console.log('Fetching profile for:', userId);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Profile fetch error:', error);
                // If profile doesn't exist, that's okay - user needs to onboard
                if (error.code === 'PGRST116') {
                    console.log('No profile found - user needs onboarding');
                    setCurrentUser(null);
                    return;
                }
                throw error;
            }

            console.log('✅ Profile loaded:', data.username);
            setCurrentUser(data);
        } catch (error) {
            console.error('Profile fetch error:', error);
            setCurrentUser(null);
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
