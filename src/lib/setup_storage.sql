-- SUPABASE STORAGE SETUP FOR BOUNTY MISSIONS
-- Run this in Supabase SQL Editor

-- 1. Create storage bucket for mission PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('bounty-missions', 'bounty-missions', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies for bounty-missions bucket

-- Allow payers to upload mission PDFs
CREATE POLICY "Payers can upload mission PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'bounty-missions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'payer'
    )
);

-- Allow anyone to read mission PDFs (but only if they're staked on the bounty)
-- For now, make it public so hunters can download after staking
CREATE POLICY "Public read access to mission PDFs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bounty-missions');

-- Allow payers to delete their own mission PDFs
CREATE POLICY "Payers can delete their own mission PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'bounty-missions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
