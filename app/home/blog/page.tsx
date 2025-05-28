"use client"
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [activePosts, setActivePosts] = useState<Post[]>([]);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchActivePosts();
  }, []);

  const fetchActivePosts = async () => {
    const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching active posts:", error);
    } else {
      setActivePosts(data);
      console.log("Active posts fetched successfully:", data);
    }
  }

  useEffect(() => {
    const savedDrafts = localStorage.getItem("draftPosts");
    if (savedDrafts) {
      setDraftPosts(JSON.parse(savedDrafts));
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent, status: "draft" | "active") => {
    e.preventDefault();
    
    if (status === "active") {
      const { error } = await supabase
      .from("posts")
      .insert([
        {
          title: formData.title,
          content: formData.content,
          status: "active",
          created_at: new Date().toISOString()
        }
      ])

      if (error) {
        console.error("Error creating active post:", error);
      } else {
        await fetchActivePosts();
        setFormData({ title: "", content: "" });
        setIsModalOpen(false);
      }
    } else {
      const newDraft = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        created_at: new Date().toISOString()
      }
      const updatedDrafts = [...draftPosts, newDraft];
      setDraftPosts(updatedDrafts);

      localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts));
      setFormData({ title: "", content: "" });
      setIsModalOpen(false);
    }
  }

    return (
      <div className="max-w-screen-lg  mx-auto h-screen px-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[20px] row-start-2 ">
        <div className="flex justify-start gap-10">
          <h1 className="h1">Share your Blog</h1>
          <button 
            className="bg-primary text-white px-15 py-2 rounded-md bg-violet-500 hover:bg-primary/80" 
            onClick={() => setIsModalOpen(true)}
          >
            Create
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[500px] border-2 border-gray-300">
              <h2 className="text-2xl font-bold mb-4">Create New Blog Post</h2>
              <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="p-3 mt-1 block w-full rounded-md border-gray-300 border-2 focus:border-primary focus:ring-primary"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  className="p-3 mt-1 block w-full rounded-md border-gray-300 border-2 focus:border-primary focus:ring-primary"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, "active")}
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-500 rounded-md hover:bg-primary/80"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}
        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <h2 className="slim-h2 text-gray-500">Draft</h2>

            <div className="flex gap-5 flex-wrap justify-start">
              {draftPosts.map((post) => (
                <div key={post.id} className="flex flex-col w-[450px] border-2 border-gray-300 rounded-md p-4">
                <p>{new Date(post.created_at).toLocaleDateString()}</p>
                <div className="flex flex-col mt-2">
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <p>{post.content}</p>
                  <div className="flex justify-around gap-2 mt-2">
                    <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        const updatedDrafts = draftPosts.filter(p => p.id !== post.id);
                        setDraftPosts(updatedDrafts);
                        localStorage.setItem("draftPosts", JSON.stringify(updatedDrafts));
                      }}
                      className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              ))}
              {draftPosts.length === 0 && (
                <p className="text-gray-500">No draft posts</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="slim-h2 text-gray-500">Active</h2>
            <div className="flex gap-5 flex-wrap justify-start">
              {activePosts.map((post) => (
                <div key={post.id} className="flex flex-col w-[450px] border-2 border-gray-300 rounded-md p-4">
                <p>{new Date(post.created_at).toLocaleDateString()}</p>
                <div className="flex flex-col mt-2">
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <p>{post.content}</p>
                  <div className="flex justify-around gap-2 mt-2">
                    <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80">
                      Edit
                    </button>
                    <button 
                      onClick={async () => {
                        const { error } = await supabase
                          .from('posts')
                          .delete()
                          .eq('id', post.id);
                        if (!error) {
                          await fetchActivePosts();
                        }
                      }}
                      className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              ))}
              {activePosts.length === 0 && (
                <p className="text-gray-500">No active posts</p>
              )}
              {/* <div className="flex flex-col w-[450px] border-2 border-gray-300 rounded-md p-4">
                  <p>2025-05-28</p>
                  <div className="flex flex-col mt-2">
                    <h2 className="text-2xl font-semibold">Blog Title</h2>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                      quos.sdcjdnfvndfjvnjdndsfv adkf msdkasdnvakdvas
                    </p>
                    <div className="flex justify-around gap-2 mt-2">
                      <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80">
                        Edit
                      </button>
                      <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-primary/80">
                        Delete
                      </button>
                    </div>
                  </div>
                </div> */}
            </div>
          </div>

        </div>
      </main>
    </div>
    );
}