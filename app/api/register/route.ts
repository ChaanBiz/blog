import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        console.log("Supabase URL:", supabaseUrl);
        console.log("Supabase Key exists:", !!supabaseKey);
        console.log("1. Registration request received");

        const body = await request.json();
        console.log("2. Registration request body:", body);

        const { username, email, password } = body;
        console.log("3. Extracted data:", {username, email, password});

        console.log("4. Checking for existing user");
        const { data: existingUser } = await supabase
        .from("users")
        .select()
        .or(`username.eq.${username},email.eq.${email}`);

        console.log("5. Existing user data:", existingUser);

        // if (existingUser) {
        //     console.log("6. User already exists");
        //     return NextResponse.json(
        //         { message: "Username or email already exists"}, 
        //         { status: 400 }
        //     );
        // }

        console.log("Creating auth data");

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    username: username,
                }
            }
        });

        console.log("Auth data:", {authData, authError});

        if (authError) {
            console.error("Registration error:", authError);
            if (authError.message.includes("security purposes")) {
                return NextResponse.json(
                    { message: "Too many signup attempts. Please try again later."},
                    { status: 429 }
                );
            }
            return NextResponse.json(
                { message: authError.message },
                { status: 500 }
            );
        }

        console.log("Creating profile");

        const { error: profileError } = await supabase
        .from("users")
        .insert([
            {
                id: authData.user?.id,
                username,
                email,
            }
        ]);

        console.log("Profile creation result:", {profileError});

        if (profileError) {
            console.error("Profile creation error:", profileError);
            return NextResponse.json(
                { 
                    message: profileError.message || "An error occurred during profile creation",
                    details: profileError.details,
                    hint: profileError.hint,
                },
                { status: 500 }
            );
        }

        console.log("Registration successful");

        return NextResponse.json(
            { message: "Registration successful" },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An error occurred during registration" }, 
            { status: 500 }
        );
    }
}