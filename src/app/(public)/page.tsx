import { redirect } from "next/navigation";

export default async function Home() {

  // 리다이렉트 ㄱㄱ
  redirect("/contents");

  return (
      <main className="">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl">
            🥺
          </p>
        </div>
      </main>
  );
}