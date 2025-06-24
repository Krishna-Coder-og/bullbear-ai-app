import { createClient } from '@supabase/supabase-js'

// These variables should already be in your .env.local file from Step 0
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates a single, reusable connection to our database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)