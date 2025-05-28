"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
    });

    // const validateField = (name: string, value: string) => {
    //     let error = "";

    //     switch(name) {
    //         case "username":
    //             if (value.length < 3) {
    //                 error = "Username must be at least 3 characters long";
    //             } else if (value.length > 20) {
    //                 error = "Username must be less than 20 characters long";
    //             } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    //                 error = "Username must contain only letters, numbers, and underscores";
    //             }
    //             break;
    //         case "email":
    //             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    //                 error = "Invalid email address";
    //             }
    //             break;
    //         case "password":
    //             if (value.length < 8) {
    //                 error = "Password must be at least 8 characters long";
    //             } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    //                 error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    //             }
    //             break;
    //         case "confirmPassword":
    //             if (value !== formData.password) {
    //                 error = "Passwords do not match"
    //             }
    //             break;
    //     }

    //     return error;
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Sending registration request:", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            console.log("Registration response:", response);

            const data = await response.json();
            console.log("Registration response data:", data);

            if (response.ok) {
                router.push("/login");
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: data.message || "Registration failed",
                }));
            }
        } catch (error) {
            console.error("Registration error:", error);
            setErrors(prev => ({
                ...prev,
                general: "An error occurred during registration",
            }));
        }
    }

    return (
    <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen px-8 gap-16 sm:p-10 sm:pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 ">
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <h1 className="text-4xl font-bold">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
            <div>
                <input className={`border-2 ${errors.username ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`} 
                type="text" 
                placeholder="Username" 
                name="username" 
                value={formData.username} 
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} 
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div>
                <input className={`border-2 ${errors.email ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`} 
                type="text" 
                placeholder="Email" 
                name="email" 
                value={formData.email} 
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
                <input className={`border-2 ${errors.password ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`} 
                type="password" 
                placeholder="Password" 
                name="password" 
                value={formData.password} 
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
                <input className={`border-2 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`} 
                type="password" 
                placeholder="Confirm Password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <Link href="/login" className="text-sm text-violet-500 hover:text-violet-600">Already have an account? Login</Link>

            <button 
                type="submit"
                className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-600 px-10 py-3 cursor-pointer w-full"
            >
                Register
            </button>

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}