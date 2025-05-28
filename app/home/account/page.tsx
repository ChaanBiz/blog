export default function AccountPage() {
  return (
    <div className="max-w-screen-lg  mx-auto h-screen px-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[20px] row-start-2 ">
        <h1 className="h1">Account Page</h1>
        <div className="flex gap-4">
          <button className="bg-primary text-white px-15 py-2 rounded-md bg-violet-500 hover:bg-primary/80">
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}