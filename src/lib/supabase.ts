import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase environment variables. Check your .env file or deployment settings.');
}

// Create client. If keys are missing, we use a placeholder to prevent the app from crashing at startup.
// The auth calls will fail gracefully (handled by AuthContext), allowing the UI to show the config warning.
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseKey || 'placeholder-key';

// Create client with custom configuration for better reliability
export const supabase = createClient(url, key, {
    auth: {
        persistSession: true, // Explicitly enable session persistence
        storage: window.localStorage, // Use localStorage
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
    global: {
        // Add custom fetch with longer timeout (30s) to fix "Request timed out" issues
        fetch: async (url, options = {}) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        },
    },
});
