'use client';

import Link from 'next/link';
import { CgProfile } from "react-icons/cg";
import { useSupabase } from '@/lib/SupabaseProvider';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';

// Dummy user data for illustration. Replace with real API calls as needed.
const mockUser = {
  totalPoints: 120,
  recent: [
    { id: 1, title: "Interview with Google", points: 40, date: "2025-07-30" },
    { id: 2, title: "Interview with Meta", points: 50, date: "2025-07-28" },
    { id: 3, title: "Interview with Amazon", points: 30, date: "2025-07-25" },
  ],
};

const Leaderboard = () => {
  const { session } = useSupabase();

  // Get username from session
  const username = session?.user?.user_metadata?.full_name ||
                   session?.user?.user_metadata?.name ||
                   session?.user?.email?.split('@')[0] ||
                   'Unknown User';

  // State for leaderboard data
  const [data, setData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leaderboard`, {
          cache: 'no-store'
        });
        const leaderboardData = response.ok ? await response.json() : [];
        setData(leaderboardData);

        const usernameResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leaderboard?username=${encodeURIComponent(username)}`, {
          cache: 'no-store'
        });
        const userLeaderboardData = usernameResponse.ok ? await usernameResponse.json() : null;
        setUserData(userLeaderboardData);

        if (userLeaderboardData && userLeaderboardData.length > 0) {
          const total = userLeaderboardData.reduce((acc: number, entry: { score: number }) => acc + entry.score, 0);
          setTotalPoints(total);
        } else {
          setTotalPoints(0);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [username]);

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
              <CgProfile className="h-8 w-8 text-white" />
            </button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto mt-10 flex gap-8 px-4">
        {/* Left side: User Stats */}
        <section className="w-1/3 bg-gray-800 rounded-lg p-6 h-fit">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-2">Total Score</h2>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded w-24 mx-auto"></div>
              </div>
            ) : (
              <div className="text-4xl font-bold text-white">{totalPoints}</div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-4">Recent Practice</h3>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton for recent practice
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-4 flex justify-between items-center animate-pulse"
                  >
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                    </div>
                    <div className="bg-gray-600 px-3 py-1 rounded-full w-12 h-6"></div>
                  </div>
                ))
              ) : userData?.length > 0 ? (
                userData.map((interview: { created_at: Key | null | undefined; score: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                  <div
                    key={interview.created_at}
                    className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      {interview.created_at && <h4 className="text-white font-medium">{interview.created_at
                            ? new Date(String(interview.created_at)).toLocaleString()
                            : ""}</h4>}
                    </div>
                    <div className="bg-green-900 px-3 py-1 rounded-full">
                      <span className="text-green-400 font-semibold">+{interview.score}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No recent practice sessions
                </div>
              )}
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
                {isLoading ? (
                  // Loading skeleton for leaderboard table
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      key={index}
                      className={"animate-pulse" + (index % 2 === 0 ? " bg-gray-700" : " bg-gray-800")}
                    >
                      <td className="py-2 px-4">
                        <div className="h-4 bg-gray-600 rounded w-8"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="h-4 bg-gray-600 rounded w-24"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="h-4 bg-gray-600 rounded w-12"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="h-4 bg-gray-600 rounded w-32"></div>
                      </td>
                    </tr>
                  ))
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-gray-400">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  data?.map(
                    (
                      entry: {
                        username: string;
                        score: number;
                        created_at: string | number | Date;
                      },
                      idx: number
                    ) => (
                      <tr
                        key={entry.created_at.toString() || `row-${idx}`}
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

export default Leaderboard;