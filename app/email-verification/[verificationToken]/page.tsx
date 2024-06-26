"use client"
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { verifyEmail } from "@/app/utils/apicalls";

export default function Home() {
    const [done, setDone] = useState<boolean>(false)
    const params = useParams<{ verificationToken: string }>()
    const router = useRouter();

    useEffect(() => {
        const verify = async () => {
            await verifyEmail(params.verificationToken)
            setDone(true)
        }   
        verify()
    }, [])

    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        {done ? (
            <div>
                <p>Email uspesno verifikovan!</p>
                <Link className="btn" href={"/login"}>Login</Link>
            </div>
        ) : (
            <p>cekaj...</p>
        )}
      </main>
    )
  }
  