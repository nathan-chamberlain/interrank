import Link from "next/link";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: '#181A1B', color: '#F4FFF7' }}
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
        <section className="rounded-xl flex flex-col items-center p-8 min-h-[500px] w-full max-w-md shadow-lg" style={{ border: '1px solid #444', backgroundColor: '#232526' }}>
          <img
            src="/training.png"
            alt="Train"
            className="w-64 h-64 object-contain mb-10"
          />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F4FFF7' }}>Train</h2>
          <p className="mb-6 text-center" style={{ color: '#B0B3B8' }}>
            Practice your skills and improve your ranking by training with real interview questions.
          </p>
          <Link href="/train">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold cursor-pointer">
              Start Training
            </button>
          </Link>
        </section>
        {/* Stats & Leaderboard Section */}
        <section className="rounded-xl flex flex-col items-center p-8 min-h-[500px] w-full max-w-md shadow-lg" style={{ border: '1px solid #444', backgroundColor: '#232526' }}>
          <img
            src="/leaderboard.png"
            alt="Stats & Leaderboard"
            className="w-64 h-64 object-contain mb-10"
          />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F4FFF7' }}>Stats & Leaderboard</h2>
          <p className="mb-6 text-center" style={{ color: '#B0B3B8' }}>
            View your progress, analyze your stats, and see how you rank against others.
          </p>
          <Link href="/leaderboard">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold cursor-pointer">
              View Leaderboard
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}