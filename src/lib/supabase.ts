import { createClient } from '@supabase/supabase-js';

// During the build-time prerender (see src/prerender.tsx) this module is imported in
// Node, where there is no window and env vars may be absent. createClient() throws on
// an empty URL, so fall back to a dummy outside the browser. Browser behaviour is
// unchanged: a misconfigured deploy still fails loudly, exactly as before.
const isBrowser = typeof window !== 'undefined';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (isBrowser ? '' : 'https://prerender.invalid');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (isBrowser ? '' : 'prerender');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
