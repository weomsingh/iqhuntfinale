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

export const supabase = createClient(url, key);
