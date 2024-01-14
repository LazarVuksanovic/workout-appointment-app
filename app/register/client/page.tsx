"use client"
import { useState } from "react";

export default function Home() {
    const [inputs, setInputs] = useState<ClientCreateDto>({
        username:'',
        password:'',
        email:'',
        dateOfBirth:null,
        firstName:'',
        lastName:'',

    });

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Register as Client</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleLogin}>
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
                    <label htmlFor="username">Username</label>
                    <input onChange={handleInputChange} type="text" name='username' id="username" className="input" ></input>
                </div>
                <button className="btn">Register</button>
            </form>
        </div>
      </main>
    )
  }
  