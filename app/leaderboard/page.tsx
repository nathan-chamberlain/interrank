import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// Dummy user data for illustration. Replace with real API calls as needed.
const mockUser = {
  totalPoints: 120,
  recent: [
    { id: 1, title: "Interview with Google", points: 40, date: "2025-07-30" },
    { id: 2, title: "Interview with Meta", points: 50, date: "2025-07-28" },
    { id: 3, title: "Interview with Amazon", points: 30, date: "2025-07-25" },
  ],
};

export default async function Leaderboard() {
  // Fetch leaderboard data from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leaderboard`, {
    cache: 'no-store'
  });
  const data = response.ok ? await response.json() : [];

  // TODO: Replace mockUser with real user data fetching logic

  return (
    <main className="max-w-5xl mx-auto mt-10 flex gap-8">
      {/* Right side: Leaderboard */}
      <section className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-green-900">Leaderboard</h1>
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-3 px-4 rounded-tl">Rank</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 rounded-tr">Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                    No leaderboard data available.
                  </td>
                </tr>
              )}
              {data?.map(
                (
                  entry: {
                    username: string;
                    score: number;
                    created_at: string | number | Date;
                  },
                  idx: number
                ) => (
                  <tr
                    key={entry.username || `row-${idx}`}
                    className={"text-black" + (idx % 2 === 0 ? " bg-green-50" : " bg-white")}
                  >
                    <td className="py-2 px-4 font-semibold">{idx + 1}</td>
                    <td className="py-2 px-4">{entry.username}</td>
                    <td className="py-2 px-4">{entry.score}</td>
                    <td className="py-2 px-4">
                      {entry.created_at
                        ? new Date(entry.created_at).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}