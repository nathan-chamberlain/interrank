'use client';

import { useSupabase } from "@/lib/SupabaseProvider"

const Profile = () => {
    const { session } = useSupabase();

  // Get username from session
  const username = session?.user?.user_metadata?.full_name || 
                   session?.user?.user_metadata?.name || 
                   session?.user?.email?.split('@')[0] || 
                   'Unknown User';

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <h1 className="text-2xl font-bold mb-4 text-white">Profile</h1>
            <p className="text-lg text-white">Username: {username}</p>
        </div>
    );
}

export default Profile;