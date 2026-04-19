import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY is missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type WaitlistEntry = {
  id?: string;
  email: string;
  source?: string | null;
  ip_hash?: string | null;
  user_agent?: string | null;
  created_at?: string;
};

export type ContentEntry = {
  id?: string;
  slug: string;
  title: string;
  body: string;
  excerpt?: string | null;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  cover_image_url?: string | null;
  tags?: string[] | null;
  created_at?: string;
  updated_at?: string;
};
