import { createClient } from '@supabase/supabase-js';

// It's best to store these in environment variables for security!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function Leaderboard() {
  // Fetch username, score, and timestamp from leaderboard table
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false });

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <main className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <table className="min-w-full bg-green-900 rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Score</th>
            <th className="py-2 px-4 border-b">Time</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((entry, idx) => (
            <tr key={entry.username}>
              <td className="py-2 px-4 border-b">{idx + 1}</td>
              <td className="py-2 px-4 border-b">{entry.username}</td>
              <td className="py-2 px-4 border-b">{entry.score}</td>
              <td className="py-2 px-4 border-b">
                {entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}