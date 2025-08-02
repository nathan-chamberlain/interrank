import { createClient } from '@supabase/supabase-js';

// It's best to store these in environment variables for security!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    // Fetch username, score, and timestamp from leaderboard table
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}