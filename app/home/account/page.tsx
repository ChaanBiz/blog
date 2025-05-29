"use client";

import { useState, useEffect, useCallback} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchUserProfile = useCallback(async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("Auth state", user, userError);
    console.log("Session: ", await supabase.auth.getSession());

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (!user) {
      console.log("No user found - redirecting to login");
      window.location.href = "/login";
      return;
    }

    if (user) {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("profile", profile);
      console.log("profile error: ", error);

      if (profile) {
        setProfile(profile);
        if (profile.avatar_url) {
          setPreviewUrl(profile.avatar_url);
        }
      }
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !avatarUrl) return;

    try {
      const fileExt = avatarUrl.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarUrl);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("users")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      await fetchUserProfile();
      setIsEditing(false);
      setAvatarUrl(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
  
  return (
    <div className="max-w-screen-lg  mx-auto h-screen px-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[20px] row-start-2 ">
        <h1 className="h1">Account Page</h1>

        {profile&& (
          <div className="flex flex-col items-center gap-6 p-6 border-2 border-gray-200 rounded-lg">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                {previewUrl ? (
                  <Image 
                    src={previewUrl} 
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-violet-500 text-white p-2 rounded-full cursor-pointer hover:bg-violet-600">
                <input 
                  type="file" 
                  id="avatar-upload" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold">{profile.username}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false)
                    setAvatarUrl(null)
                    setPreviewUrl(profile.avatar_url || null)
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-primary text-white px-15 py-2 rounded-md bg-violet-500 hover:bg-primary/80"
        >
          Log Out
        </button>

        {/* <div className="flex gap-4">
          <button className="bg-primary text-white px-15 py-2 rounded-md bg-violet-500 hover:bg-primary/80">
            Log Out
          </button>
        </div> */}

      </main>
    </div>
  );
}