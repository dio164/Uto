-- ==============================================================================
-- Schema for "things I couldn't say" - Digital Poetry Journal
-- ==============================================================================

-- 1. Create the poems table
CREATE TABLE IF NOT EXISTS public.poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    body TEXT NOT NULL,
    dedication TEXT,
    poem_date TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on order_index for fast sequential retrieval
CREATE INDEX IF NOT EXISTS idx_poems_order_index ON public.poems (order_index ASC, created_at ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- 4. Policies:
-- Allow anyone (public anon visitors) to read poems
CREATE POLICY "Public visitors can read poems"
    ON public.poems
    FOR SELECT
    USING (true);

-- Allow authenticated users (admin) to insert poems
CREATE POLICY "Authenticated users can insert poems"
    ON public.poems
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users (admin) to update poems
CREATE POLICY "Authenticated users can update poems"
    ON public.poems
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin) to delete poems
CREATE POLICY "Authenticated users can delete poems"
    ON public.poems
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Trigger to automatically refresh updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_poems_updated_at ON public.poems;
CREATE TRIGGER set_poems_updated_at
    BEFORE UPDATE ON public.poems
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Seed starter romantic poems
INSERT INTO public.poems (title, subtitle, body, dedication, poem_date, order_index)
VALUES
(
    'I Found Your Name',
    'in the spaces between words',
    'I found your name
between the spaces
of everything
I never said.

And somehow
even silence
sounded like you.',
    'For the one who lingers in the margins',
    'October 14th',
    0
),
(
    'Pressed Roses',
    'on dried parchment',
    'We dry the petals
to convince ourselves
that beauty can survive
the loss of summer.

I keep your letters
for the very same reason.',
    'To fragile keepsakes',
    'November 2nd',
    1
),
(
    'The Architecture of Longing',
    'midnight thoughts',
    'You built a room inside my chest
without laying a single brick.

A lantern left burning,
a window open to the rain,
and the quiet certainty
that no one else
will ever live here.',
    'Written by candlelight',
    'December 19th',
    2
),
(
    'Saltwater & Ink',
    'an unsent confession',
    'Some confessions
are too heavy for paper;
they drown the pen
before the first line dries.

So I wrote your memory
into the sea instead,
and let the tide
tell you everything.',
    'For the shore we once walked',
    'January 8th',
    3
),
(
    'Afterglow',
    'in the morning mist',
    'Do not grieve the twilight, darling.
Even the sun must close its eyes
so that the stars
can have their say.',
    'At dawn',
    'February 14th',
    4
)
ON CONFLICT DO NOTHING;
