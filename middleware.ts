import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    await supabase.auth.getSession();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session && req.nextUrl.pathname.startsWith('/home')) {
        const redirectUrl = new URL('/login', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    if (session && (
        req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register') ||
        req.nextUrl.pathname.startsWith('/reset-password')
    )){
        const redirectUrl = new URL('/home', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: [
        '/home/:path*',
        '/login',
        '/register',
        '/reset-password'
    ]
}