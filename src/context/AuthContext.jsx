import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        checkSession();

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

        return () => subscription.unsubscribe();
    }, []);

    async function checkSession() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                await fetchProfile(session.user.id);
            }
        } catch (error) {
            console.error('Session check error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
