import Link from "next/link";
import { CgProfile } from "react-icons/cg";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: '#181A1B', color: '#F4FFF7' }}
    >
      {/* Logo at the top center */}
      <header className="w-full flex items-center justify-between py-4 px-8">
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
            <Link href="/train" className="text-white font-semibold px-2 py-1 hover:underline transition-colors">Train</Link>
            <Link href="/leaderboard" className="text-white font-semibold px-2 py-1 hover:underline transition-colors">Leaderboard</Link>
          </div>
          <Link href="/profile">
            <button className="bg-[#2D6F40] hover:bg-[#245732] p-2 rounded-full flex items-center justify-center ml-8">
              <CgProfile className="h-8 w-8 text-white" />
            </button>
          </Link>
        </nav>
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
          <Link href="/train/interview-listings">
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
            <button className="bg-[#2D6F40] hover:bg-[#245732] text-white px-6 py-2 rounded font-semibold cursor-pointer">
              View Leaderboard
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}