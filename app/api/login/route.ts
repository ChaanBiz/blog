import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();


        console.log("Login attempt:", {email, password, passwordLength: password.length});

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log("Supabase auth error:", {
                message: error.message,
                name: error.name,
                status: error.status,
            });
            return NextResponse.json(
                { 
                    message: error.message,
                    error: error.name,
                    status: error.status,
                },
                { status: 400 }
            );
        }

        const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .single();
        
        if (profileError) {
            return NextResponse.json(
                { message: "An error occurred during profile retrieval" },
                { status: 500 }
            );
        }

        const response = NextResponse.json(
            { 
                message: "Login successful", 
                user: {
                    id: profile.id,
                    username: profile.username,
                    email: profile.email,
                }
                //token: data.session?.access_token,
            },
            { status: 200 }
        );

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "An error occurred during login" },
            { status: 500 }
        );
    }
}