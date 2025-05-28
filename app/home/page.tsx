export default function LoginPage() {
  return (
    <div className="max-w-screen-lg mx-auto h-screen px-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[20px] row-start-2 ">
        <h1 className="h1">Blog Feed</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col border-2 border-gray-300 rounded-md p-4 mx-2">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p>User Name</p>
                <p>2025-05-28</p>
              </div>
              <button className="bg-primary text-black px-15 py-2 rounded-md border-2 border-gray-300 hover:bg-gray-100">
                View
              </button>
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-2xl font-semibold">Blog Title</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                quos.sdcjdnfvndfjvnjdndsfv adkf msdkasdnvakdvas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
