'use client';

import { useRef, useState } from "react";
import { useSupabase } from "@/lib/SupabaseProvider"

const Profile = () => {
  const { session, supabase } = useSupabase();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    session?.user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split('@')[0] ||
        'Unknown User'
      )}&background=0D8ABC&color=fff`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user details from session
  const user = session?.user;
  const username =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Unknown User';
  const email = user?.email || 'No email';

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Unknown';

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : 'Unknown';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    // --- Delete old avatar if it exists and is from your bucket ---
    if (avatarUrl && avatarUrl.includes('supabase.co/storage/v1/object/public/avatars/')) {
      // Extract the file path after .../avatars/
      const oldFilePath = avatarUrl.split('/avatars/')[1];
      if (oldFilePath) {
        await supabase.storage.from('avatars').remove([oldFilePath]);
      }
    }

    // Upload new avatar
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Failed to upload avatar!');
      setUploading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateError) {
      alert('Failed to update profile!');
      setUploading(false);
      return;
    }

    setAvatarUrl(publicUrl);
    setUploading(false);
  };

  return (
    <div className="bg-gray-900">
      {/* Profile Section */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
          <div className="relative mb-4">
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-28 h-28 rounded-full border-4 border-green-400 shadow-lg object-cover"
            />
            <button
              className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow transition"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Change profile picture"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>
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
          {uploading && <p className="mt-2 text-green-400">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;