-- ==============================================================================
-- Migration: Uto / Jessica Experience Cloud Content
-- Run this in your Supabase SQL Editor to enable database sync across all devices
-- ==============================================================================

-- 1. Create the jessica_content table
CREATE TABLE IF NOT EXISTS public.jessica_content (
    id TEXT PRIMARY KEY DEFAULT 'current',
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    appreciations JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.jessica_content ENABLE ROW LEVEL SECURITY;

-- 3. Grant table permissions
GRANT SELECT ON public.jessica_content TO anon, authenticated;
GRANT ALL ON public.jessica_content TO authenticated;
GRANT ALL ON public.jessica_content TO anon;

-- 4. Clean up any existing policies
DROP POLICY IF EXISTS "Public visitors can read jessica content" ON public.jessica_content;
DROP POLICY IF EXISTS "Anyone can update jessica content" ON public.jessica_content;
DROP POLICY IF EXISTS "Authenticated users can update jessica content" ON public.jessica_content;

-- 5. Policies: Allow public read, allow admin/authenticated updates
CREATE POLICY "Public visitors can read jessica content"
    ON public.jessica_content
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can update jessica content"
    ON public.jessica_content
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Trigger to automatically refresh updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_jessica_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_jessica_updated_at ON public.jessica_content;
CREATE TRIGGER set_jessica_updated_at
    BEFORE UPDATE ON public.jessica_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_jessica_updated_at();

