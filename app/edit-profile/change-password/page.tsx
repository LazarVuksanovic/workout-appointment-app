"use client"
import { useState } from "react";

export default function Home() {
    const [inputs, setInputs] = useState<ChangePasswordInputs>({oldPassword:'', newPassword:''});

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`username: ${inputs.oldPassword}, password ${inputs.newPassword}`);
    }
    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Change password</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleLogin}>
            <div className="flex flex-col">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input onChange={handleInputChange} type="password" name='oldPassword' id="oldPassword" className="input"></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="newPassword">New Password</label>
                    <input onChange={handleInputChange} type="password" name='newPassword' id="newPassword" className="input"></input>
                </div>
                <button className="btn">Change</button>
            </form>

        </div>
      </main>
    )
  }
  