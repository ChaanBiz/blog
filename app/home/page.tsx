"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  is_active: boolean;
  users: {
    username: string;
  }
}

export default function LoginPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *, 
          users!inner (
            username
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log("Fetched posts:", data);
      console.log("Query error:", error);

      if (error) { 
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data || [])
    }

    fetchPosts();
  }, [supabase]);
  
  return (
    <div className="max-w-screen-lg mx-auto h-screen px-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[20px] row-start-2 ">
        <h1 className="h1">Blog Feed</h1>
        <div className="flex flex-col gap-4">

          {posts.map((post) => (
            <div key={post.id}
              className="flex flex-col border-2 border-gray-300 rounded-md p-4 mx-2"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p>{post.users?.username || "Unknown User"}</p>
                  <p>{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <Link 
                  href={`/post/${post.id}`}
                  className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-gray-100"
                >
                  View
                </Link>
              </div>
              <div className="flex flex-col mt-2">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="line-clamp-3">{post.content}</p>
              </div>
            </div>
          ))}

          {/* <div className="flex flex-col border-2 border-gray-300 rounded-md p-4 mx-2">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p>User Name</p>
                <p>2025-05-28</p>
              </div>
              <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-gray-100">
                View
              </button>
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-2xl font-semibold">Blog Title</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                quos.sdcjdnfvndfjvnjdndsfv adkf msdkasdnvakdvas
              </p>
            </div>
          </div> */}

        </div>
      </main>
    </div>
  );
}
