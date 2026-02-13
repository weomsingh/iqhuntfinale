import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase environment variables. Check your .env file or deployment settings.');
}

// Create client. If keys are missing, this will likely throw or fail immediately, 
// which is better than timing out on a dummy URL.
const url = supabaseUrl || '';
const key = supabaseKey || '';

export const supabase = createClient(url, key);
