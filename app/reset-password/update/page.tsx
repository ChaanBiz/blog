"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleRecovery = async () => {
            const hash = window.location.hash;
            if (!hash) {
                setError("Invalid reset link");
                setIsLoading(false);
                return;
            }

            // Parse the hash parameters
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const type = params.get('type');

            if (type !== 'recovery' || !accessToken) {
                setError("Invalid reset link");
                setIsLoading(false);
                return;
            }

            try {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: params.get('refresh_token') || '',
                });

                if (error) {
                    setError("Invalid or expired reset link");
                }
            } catch (err) {
                console.error("Failed to process reset link:", err);
                setError("Failed to process reset link");
            }
            setIsLoading(false);
        };

        handleRecovery();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Password updated successfully");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error) {
            console.error("Update password error:", error);
            setError("An error occurred while updating password");
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen px-8 gap-16 sm:p-10 sm:pb-20">
            <main className="flex flex-col gap-[32px] row-start-2">
                <div className="flex flex-col gap-4 items-center justify-center h-full">
                    <h1 className="text-4xl font-bold">Reset Password</h1>
                    {error ? (
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-red-500 text-sm">{error}</p>
                            <Link href="/reset-password" className="text-violet-500 hover:text-violet-600">
                                Request a new password reset link
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                                className="border-2 border-gray-300 rounded-md p-2"
                                required
                                minLength={6}
                            />
                            {message && <p className="text-green-500 text-sm">{message}</p>}
                            <button type="submit" className="bg-violet-500 text-white rounded-md p-2">
                                Update Password
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}