"use client"
import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "../utils/contexts/Context";

export default function Home() {
    const [inputs, setInputs] = useState<TokenRequestDto>({username:'', password:''});
    const {logIn} = useAppContext();

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logIn(inputs);
    }
    return (
      <main className="flex flex-col min-h-screen items-center p-24 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Login</h1>
            <form className="flex flex-col space-y-10 items-center" onSubmit={handleLogin}>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input onChange={handleInputChange} type="text" name='username' id="username" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input onChange={handleInputChange} type="password" name='password' id="password" className="input"></input>
                </div>
                <button className="btn">Login</button>
                <Link href={"/register"} className="text-sm hover:text-blue-500">Registruj se</Link>
            </form>
        </div>
      </main>
    )
  }
  