'use client';

import { useSupabase } from "@/lib/SupabaseProvider"

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
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
  );
}

export default Profile;