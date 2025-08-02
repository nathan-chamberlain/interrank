import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <header className="w-full flex items-center justify-between py-4 px-8 bg-gray-800">
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/logo.png"
              alt="INTERRANK Logo"
              className="h-16 w-auto cursor-pointer"
              style={{ minWidth: '64px' }}
            />
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-8">
            <Link href="/train" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Train</Link>
            <Link href="/leaderboard" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Leaderboard</Link>
          </div>
          <Link href="/profile">
            <button className="bg-green-700 hover:bg-green-600 p-2 rounded-full flex items-center justify-center ml-8">
              <img src="/profile-icon.png" alt="Profile" className="h-8 w-8" />
            </button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto mt-10 flex gap-8 px-4">
        {/* Left side: User Stats */}
        <section className="w-1/3 bg-gray-800 rounded-lg p-6 h-fit">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-2">Total Score</h2>
            <div className="text-4xl font-bold text-white">{mockUser.totalPoints}</div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-4">Recent Practice</h3>
            <div className="space-y-4">
              {mockUser.recent.map((interview) => (
                <div 
                  key={interview.id} 
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-white font-medium">{interview.title}</h4>
                    <p className="text-gray-400 text-sm">{interview.date}</p>
                  </div>
                  <div className="bg-green-900 px-3 py-1 rounded-full">
                    <span className="text-green-400 font-semibold">+{interview.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right side: Leaderboard */}
        <section className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-green-400">Leaderboard</h1>
          <div className="overflow-x-auto rounded shadow bg-gray-800">
            <table className="min-w-full text-left">
              <thead className="bg-green-900 text-gray-100">
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
                    <td colSpan={4} className="py-6 px-4 text-center text-gray-400">
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
                      className={"text-gray-200" + (idx % 2 === 0 ? " bg-gray-700" : " bg-gray-800")}
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
    </div>
  );
}