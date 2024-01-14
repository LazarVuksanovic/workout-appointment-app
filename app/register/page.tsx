import Link from "next/link";

export default function Home() {
    return (
      <main className="flex flex-col min-h-screen items-center p-24 space-y-16">
        <h1 className="text-3xl">Register as</h1>
        <div className="flex gap-5">
            <Link href={"register/client"} className="text-lg bg-cyan-200 hover:bg-cyan-300
            hover:border-black/50 border-2 border-white rounded-lg p-20">Client</Link>
            <Link href={"register/gymmanager"} className="text-lg bg-cyan-200 hover:bg-cyan-300
            hover:border-black/50 border-2 border-white rounded-lg p-20">Gym manager</Link>
        </div>
      </main>
    )
  }
  