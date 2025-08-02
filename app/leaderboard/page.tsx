import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function Leaderboard() {
  // Fetch leaderboard data from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leaderboard`, {
    cache: 'no-store' // Ensures fresh data on each request
  });
  
  const data = response.ok ? await response.json() : [];

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
          {data?.map((entry: { username: boolean | Key | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; score: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; created_at: string | number | Date; }, idx: number) => (
            <tr key={typeof entry.username === 'string' || typeof entry.username === 'number' ? entry.username : `row-${idx}`}>
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