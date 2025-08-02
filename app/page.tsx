import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-5xl font-bold">INTERRANK</h1>
      <div className="mt-8 space-y-4">
        <div>
          <Link href="/train" className="text-blue-500 hover:underline">
            Go to Train Page
          </Link>
        </div>
        <div>
          <Link href="/transcript" className="text-green-500 hover:underline">
            Process Transcripts with AI
          </Link>
        </div>
        <div>
          <Link href="/practice" className="text-purple-500 hover:underline">
            Interview Practice (Q&A Scoring)
          </Link>
        </div>
      </div>
    </div>
  );
}
