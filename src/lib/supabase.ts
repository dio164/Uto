import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http')
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[Poetry Journal] Supabase credentials not detected or using placeholders. Running in offline/demo mode with bundled poetry.',
    'color: #C98598; font-weight: bold;'
  );
}

// Create client with fallback dummy values if not provided to prevent runtime crash on initialization
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
