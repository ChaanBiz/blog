export default function LoginPage() {
  return (
    <div className="max-w-screen-lg mx-auto h-screen px-8 pb-20 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 ">
        <h1 className="text-4xl font-bold">Blog</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col border-2 border-gray-300 rounded-md p-4 mx-2">
            <p>User Name</p>
            <p>2025-05-28</p>
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
