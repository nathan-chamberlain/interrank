import Link from "next/link";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: '#f4fff7', color: '#131614' }}
    >
      {/* Logo at the top center */}
      <header className="w-full flex justify-center py-4">
        <img
          src="/logo.png"
          alt="INTERRANK Logo"
          className="h-12 w-auto"
        />
      </header>
      {/* Main content split into two */}
      <main className="flex flex-1 justify-center items-center gap-12 px-4">
        {/* Train Section */}
        <section className="rounded-xl flex flex-col items-center p-8 min-h-[500px] w-full max-w-md shadow-lg" style={{ backgroundColor: '#e6f7ee' }}>
          <img
            src="/training.png"
            alt="Train"
            className="w-64 h-64 object-contain mb-10"
          />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#131614' }}>Train</h2>
          <p className="mb-6 text-center" style={{ color: '#9A9E9B' }}>
            Practice your skills and improve your ranking by training with real interview questions.
          </p>
          <Link href="/train">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold">
              Start Training
            </button>
          </Link>
        </section>
        {/* Stats & Leaderboard Section */}
        <section className="rounded-xl flex flex-col items-center p-8 min-h-[500px] w-full max-w-md shadow-lg" style={{ backgroundColor: '#e6f7ee' }}>
          <img
            src="/leaderboard.png"
            alt="Stats & Leaderboard"
            className="w-64 h-64 object-contain mb-10"
          />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#131614' }}>Stats & Leaderboard</h2>
          <p className="mb-6 text-center" style={{ color: '#9A9E9B' }}>
            View your progress, analyze your stats, and see how you rank against others.
          </p>
          <Link href="/leaderboard">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold">
              View Leaderboard
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}