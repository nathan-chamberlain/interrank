import Link from "next/link";

export default function Home() {
  return (
    <div
      className="w-full flex flex-col bg-gray-900 text-white items-center justify-center"
    >
      {/* Main content split into two */}
      <main className="flex flex-1 justify-center items-center gap-12 px-4 py-8">
        {/* Train Section */}
        <section className="rounded-xl flex flex-col items-center p-8 min-h-[500px] w-full max-w-md shadow-lg border-1 border-gray-700 bg-gray-800">
          <img
            src="/training.png"
            alt="Train"
            className="w-64 h-64 object-contain mb-10 rounded-lg"
          />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F4FFF7' }}>Train</h2>
          <p className="mb-6 text-center" style={{ color: '#B0B3B8' }}>
            Practice your interview skills with our AI-powered training sessions. Gain feedback and improve your performance.
          </p>
          <Link href="/train/interview-listings">
            <button className="bg-[#2D6F40] hover:bg-[#245732] text-white px-6 py-2 rounded font-semibold cursor-pointer">
              Start Training
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}