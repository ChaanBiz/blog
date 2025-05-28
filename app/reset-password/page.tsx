"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Reset password email:", email);

            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log("Reset password response:", { status: response.status, data });

            if (response.ok) {
                setMessage("Password reset email sent. Please check your inbox.");
                setError("");
            } else {
                setError(data.message || "An error occurred");
                setMessage("");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An error occurred. Please try again.");
            setMessage("");
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen px-8 gap-16 sm:p-10 sm:pb-20">
            <main className="flex flex-col gap-[32px] row-start-2">
                <div className="flex flex-col gap-4 items-center justify-center h-full">
                    <h1 className="text-4xl font-bold">Reset Password</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
                        <div>
                            <input
                                className="border-2 border-gray-300 w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {message && <p className="text-green-500 text-sm">{message}</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-600 px-10 py-3 cursor-pointer w-full"
                            type="submit"
                        >
                            Send Reset Link
                        </button>
                        <Link href="/login" className="text-sm text-violet-500 hover:text-violet-600">
                            Back to Login
                        </Link>
                    </form>
                </div>
            </main>
        </div>
    );
}