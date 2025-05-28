import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-screen-lg mx-auto flex items-center justify-center h-screen px-8 gap-16 sm:p-10 sm:pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 ">
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <h1 className="text-4xl font-bold">Welcome to Blog ni Rowan</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <div className="flex gap-4 items-center justify-center mt-5">
            <Link href="/login" className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-600 px-10 py-3">Login</Link>
            <Link href="/register" className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-600 px-10 py-3">Register</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
