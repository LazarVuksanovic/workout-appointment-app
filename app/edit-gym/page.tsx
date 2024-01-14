"use client"
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [inputs, setInputs] = useState({username:'', password:''});

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`username: ${inputs.username}, password ${inputs.password}`);
    }
    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Edit Gym</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="gymName">Gym Name</label>
                    <input onChange={handleInputChange} type="text" name='gymName' id="gymName" className="input" ></input>
                </div>
                <button className="btn">Save name</button>
            </form>
        </div>
      </main>
    )
  }
  