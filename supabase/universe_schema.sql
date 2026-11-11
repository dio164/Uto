-- ==============================================================================
-- PLANET UTO: THE GRAND UNIVERSE EXPANSION
-- ADDITIVE DATABASE SCHEMA (DOES NOT MODIFY OR DROP EXISTING TABLES)
-- Preserves public.poems and public.jessica_content intact!
-- ==============================================================================

-- 1. RECORDINGS (The Listening Room)
CREATE TABLE IF NOT EXISTS public.universe_recordings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    artwork_url TEXT,
    category TEXT NOT NULL DEFAULT 'Little Voicenotes',
    duration TEXT,
    date_recorded TEXT,
    is_published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LETTERS (The Post Office)
CREATE TABLE IF NOT EXISTS public.universe_letters (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Open When You Miss Me',
    cover_artwork TEXT,
    unlock_date TIMESTAMPTZ,
    is_locked BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. IMPORTANT DATES & COUNTDOWNS (The Celestial Observatory)
CREATE TABLE IF NOT EXISTS public.universe_dates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    target_date TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL DEFAULT 'Milestone',
    description TEXT,
    country_connection TEXT,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GARDEN FLOWERS (The Enchanted Garden)
CREATE TABLE IF NOT EXISTS public.universe_flowers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    flower_name TEXT NOT NULL,
    flower_type TEXT NOT NULL DEFAULT 'Vintage Rose',
    milestone_title TEXT NOT NULL,
    story TEXT NOT NULL,
    bloom_date TEXT NOT NULL,
    color TEXT DEFAULT '#F472B6',
    artwork_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CINEMA ARCHIVE (Our Little Cinema)
CREATE TABLE IF NOT EXISTS public.universe_cinema (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    caption TEXT,
    media_type TEXT NOT NULL DEFAULT 'photo', -- 'photo' | 'video'
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    event_date TEXT,
    recap_month TEXT,
    recap_year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. THE LITTLE THINGS ARCHIVE
CREATE TABLE IF NOT EXISTS public.universe_little_things (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    quote_or_memory TEXT NOT NULL,
    context TEXT,
    category TEXT DEFAULT 'Funny Things She Said',
    date_noted TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. THE FUTURE MUSEUM (Shared Bucket List)
CREATE TABLE IF NOT EXISTS public.universe_future_museum (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Adventures',
    status TEXT NOT NULL DEFAULT 'someday', -- 'someday' | 'planned' | 'experienced'
    target_location TEXT,
    notes TEXT,
    reflection TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. UNIVERSE SETTINGS & DISCOVERIES (Magic System & Homepage)
CREATE TABLE IF NOT EXISTS public.universe_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.universe_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_flowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_cinema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_little_things ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_future_museum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universe_settings ENABLE ROW LEVEL SECURITY;

-- PERMISSIONS
GRANT ALL ON public.universe_recordings TO anon, authenticated;
GRANT ALL ON public.universe_letters TO anon, authenticated;
GRANT ALL ON public.universe_dates TO anon, authenticated;
GRANT ALL ON public.universe_flowers TO anon, authenticated;
GRANT ALL ON public.universe_cinema TO anon, authenticated;
GRANT ALL ON public.universe_little_things TO anon, authenticated;
GRANT ALL ON public.universe_future_museum TO anon, authenticated;
GRANT ALL ON public.universe_settings TO anon, authenticated;

-- RLS POLICIES: Public read access
CREATE POLICY "Public read recordings" ON public.universe_recordings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read letters" ON public.universe_letters FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read dates" ON public.universe_dates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read flowers" ON public.universe_flowers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read cinema" ON public.universe_cinema FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read little things" ON public.universe_little_things FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read future museum" ON public.universe_future_museum FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read settings" ON public.universe_settings FOR SELECT TO anon, authenticated USING (true);

-- RLS POLICIES: Update / Insert access
CREATE POLICY "All modify recordings" ON public.universe_recordings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify letters" ON public.universe_letters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify dates" ON public.universe_dates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify flowers" ON public.universe_flowers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify cinema" ON public.universe_cinema FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify little things" ON public.universe_little_things FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify future museum" ON public.universe_future_museum FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "All modify settings" ON public.universe_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. OPTIONAL: SUPABASE STORAGE BUCKET FOR DIRECT AUDIO & MEDIA UPLOADS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('universe_media', 'universe_media', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id = 'universe_media');
CREATE POLICY "Public storage modify" ON storage.objects FOR ALL TO anon, authenticated USING (bucket_id = 'universe_media') WITH CHECK (bucket_id = 'universe_media');


