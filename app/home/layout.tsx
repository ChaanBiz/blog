import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog ni Rowan",
  description: "Blog ni Rowan",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <header className="sticky top-0 z-10 bg-white flex justify-center items-center p-4 shadow-sm font-[family-name:var(--font-geist-sans)]">
          <nav className="container mx-auto flex justify-center">
            <ul className="flex space-x-4">
              <li><Link href="/home" className="hover:text-violet-500">Home</Link></li>
              <li><Link href="/home/blog" className="hover:text-violet-500">Blog</Link></li>
              <li><Link href="/home/account" className="hover:text-violet-500">Account</Link></li>
            </ul>
          </nav>
        </header>
        {children}
    </>
  );
}
