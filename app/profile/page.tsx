'use client';

import { useSupabase } from "@/lib/SupabaseProvider"
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const { session, supabase } = useSupabase();

  // Get user details from session
  const user = session?.user;
  const username =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Unknown User';
  const email = user?.email || 'No email';
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D8ABC&color=fff`;

  // Example: join date from user.created_at
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Unknown';

  // Example: last sign in
  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : 'Unknown';

  // Move handleSignOut inside the component and use supabase
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

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
            <Link href="/leaderboard" className="text-gray-200 font-semibold px-2 py-1 hover:text-white hover:underline transition-colors">Stats/Leaderboard</Link>
          </div>
          <Link href="/profile">
            <button className="bg-green-700 hover:bg-green-600 p-2 rounded-full flex items-center justify-center ml-8">
              <CgProfile className="h-8 w-8 text-white" />
            </button>
          </Link>
        </nav>
      </header>
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
          <img
          src={avatarUrl}
          alt="Profile Avatar"
          className="w-28 h-28 rounded-full border-4 border-green-400 shadow-lg mb-4"
        />
        <h1 className="text-3xl font-extrabold text-green-400 mb-2">{username}</h1>
        <p className="text-gray-300 mb-2">{email}</p>
        <div className="w-full border-t border-gray-700 my-4"></div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between text-gray-400">
            <span className="font-semibold">Joined:</span>
            <span>{joinDate}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span className="font-semibold">Last Sign In:</span>
            <span>{lastSignIn}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span className="font-semibold">Provider:</span>
            <span className="capitalize">{user?.app_metadata?.provider || 'email'}</span>
          </div>
        </div>
        <button
          className="mt-8 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
    </div>
  );
}

export default Profile;