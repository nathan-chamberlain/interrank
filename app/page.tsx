import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black w-full min-h-screen flex flex-col">
      {/* Logo at the top center */}
      <header className="w-full flex justify-center py-8">
        <h1 className="text-white text-5xl font-bold">INTERRANK</h1>
      </header>
      {/* Main content split into two */}
      <main className="flex flex-1 justify-center items-center gap-12 px-4">
        {/* Train Section */}
        <section className="bg-gray-900 rounded-xl flex flex-col items-center p-8 w-full max-w-md shadow-lg">
          <img
            src="/train-image.png"
            alt="Train"
            className="w-32 h-32 object-contain mb-6"
          />
          <h2 className="text-white text-2xl font-semibold mb-2">Train</h2>
          <p className="text-gray-300 mb-6 text-center">
            Practice your skills and improve your ranking by training with real interview questions.
          </p>
          <Link href="/train">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold">
              Start Training
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}