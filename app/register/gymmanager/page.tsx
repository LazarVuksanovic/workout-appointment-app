"use client"
import { registerManager } from "@/app/utils/methods";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [inputs, setInputs] = useState<ManagerCreateDto>({
        username:'',
        password:'',
        email:'',
        dateOfBirth:null,
        firstName:'',
        lastName:'',
        gymName: '',
    });

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await registerManager(inputs);
        router.push("/login")
    };
    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Register as Client</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleRegister}>
                <div className="flex flex-col">
                    <label htmlFor="firstName">First Name</label>
                    <input onChange={handleInputChange} type="text" name='firstName' id="firstName" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName">Last Name</label>
                    <input onChange={handleInputChange} type="text" name='lastName' id="lastName" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input onChange={handleInputChange} type="date" name='dateOfBirth' id="dateOfBirth" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input onChange={handleInputChange} type="email" name='email' id="email" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="gymName">Gym name</label>
                    <input onChange={handleInputChange} type="text" name='gymName' id="gymName" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input onChange={handleInputChange} type="text" name='username' id="username" className="input" ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input onChange={handleInputChange} type="password" name='password' id="password" className="input" ></input>
                </div>
                <button className="btn">Register</button>
            </form>
        </div>
      </main>
    )
  }
  