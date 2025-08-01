import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-5xl font-bold">INTERRANK</h1>
      <div className="mt-8">
        <Link href="/train" className="text-blue-500 hover:underline">
          Go to Train Page
        </Link>
      </div>
    </div>
  );
}
