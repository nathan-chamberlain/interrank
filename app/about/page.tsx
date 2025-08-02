export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-green-400 mb-4">About Interrank</h1>
        <p className="text-gray-200 mb-4">
          <span className="font-semibold text-green-300">Interrank</span> is a modern platform designed to help you prepare for interviews, track your progress, and connect with a community of learners and professionals.
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Practice real and general interview questions</li>
          <li>Track your performance and climb the leaderboard</li>
          <li>Personalize your profile and showcase your achievements</li>
          <li>Secure authentication with social providers</li>
        </ul>
        <p className="text-gray-400 text-sm">
          Built with <span className="text-green-300">Next.js</span>, <span className="text-green-300">Supabase</span>, and <span className="text-green-300">Tailwind CSS</span>.
        </p>
        <div className="mt-8 text-center">
          <span className="text-gray-500 text-xs">© {new Date().getFullYear()} InterRank. All rights reserved.</span>
        </div>
      </div>
    </div>
    );
}