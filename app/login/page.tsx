"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: "",
    });

    const validateField = (name: string, value: string) => {
        let error = "";

        switch(name) {
            case "email":
                if (!value) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Invalid email address";
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 characters long";
                }
                break;
        }
        return error;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));

        const error = validateField(name, value);
        setErrors(prev => ({ 
            ...prev, 
            [name]: error 
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
            general: "",
        };

        setErrors(newErrors);

        if (Object.values(newErrors).every(error => error !== "")) {
            return;
        }

        try {
            // const response = await fetch("/api/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         email: formData.email,
            //         password: formData.password,
            //     }),
            // });

            //const data = await response.json();

            // if (response.ok) {
            //     console.log("Login successful:", data);
            //     router.push("/home");
            // } else {
            //     console.log("Login failed:", data);
            //     setErrors(prev => ({
            //         ...prev,
            //         general: data.message || "Invalid username or password",
            //     }));
            // }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                console.log("Login failed:", error);
                setErrors(prev => ({
                    ...prev,
                    general: error.message || "Invalid username or password"
                }))
                return
            }

            if (data.session) {
                console.log("Login successful:", data);
                await supabase.auth.setSession(data.session);
                
                try {
                    await router.push("/home");
                } catch (navigationError) {
                    console.error("Router navigation failed, using window.location:", navigationError);
                    window.location.href = "/home";
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors(prev => ({
                ...prev,
                general: "An error occurred during login"
            }));
        }
    }
    return (
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen px-8 gap-16 sm:p-10 sm:pb-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 ">
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <h1 className="text-4xl font-bold">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
                <div>
                    <input className={`border-2 ${errors.email ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                    <input className={`border-2 ${errors.password ? "border-red-500" : "border-gray-300"} w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    />
                </div>
                <Link href="/reset-password" className="text-sm text-violet-500 hover:text-violet-600">Forgot password?</Link>
              <Link href="/register" className="text-sm text-violet-500 hover:text-violet-600">Don&apos;t have an account? Register</Link>
              <button className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-600 px-10 py-3 cursor-pointer w-full" type="submit">Login</button>
            </form>
          </div>
        </main>
      </div>
    );
  }
  