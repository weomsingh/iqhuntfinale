import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase environment variables. Check your .env file or deployment settings.');
}

// Create client with fallbacks to prevent crash, but functionality will fail if keys are missing
export const supabase = createClient(
    supabaseUrl || 'https://lyzkglrxondbvoshpxnv.supabase.co',
    supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5emtnbHJ4b25kYnZvc2hweG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDEyMTMsImV4cCI6MjA4NjQ3NzIxM30.bwSVQ-VKq2fCI88Kz8GRQafdY85Dmlc6lkqGwzN_zew'
);
