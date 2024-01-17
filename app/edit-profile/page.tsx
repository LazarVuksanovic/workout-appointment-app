"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { editUser } from "../utils/apicalls";

export default function Home() {
    const {getUserData} = useAppContext();
    const [userData, setUserData] = useState<any>(null);
    const [inputs, setInputs] = useState<UserUpdateDto>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: new Date,
    });

    useEffect(() => {
        const fetchData = async () => {
          const data = await getUserData();
          setUserData(data)
        }
    
        fetchData();
    }, []);

    useEffect(() => {
        setInputs({
            username: userData?.username,
            email: userData?.email,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            dateOfBirth: userData?.dateOfBirth,
        });
    },[userData]);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev:any) => ({...prev, [e.target.name]: e.target.value}))
    };

    const handleUpdate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await editUser(inputs);
        const d = await getUserData()
        setUserData(d);
    }

    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Edit profile</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleUpdate}>
                <div className="flex flex-col">
                    <label htmlFor="firstName">First Name</label>
                    <input onChange={handleInputChange} type="text" name='firstName' id="firstName" className="input" placeholder={userData?.firstName ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName">Last Name</label>
                    <input onChange={handleInputChange} type="text" name='lastName' id="lastName" className="input" placeholder={userData?.lastName ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input onChange={handleInputChange} type="date" name='dateOfBirth' id="dateOfBirth" className="input" value={userData?.dateOfBirth ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input onChange={handleInputChange} type="email" name='email' id="email" className="input" placeholder={userData?.email ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input onChange={handleInputChange} type="text" name='username' id="username" className="input" placeholder={userData?.username ?? ''}></input>
                </div>
                <button className="btn">Save</button>
            </form>
            <Link href={"/edit-profile/change-password"} className="btn mt-5">Change password</Link>
        </div>
      </main>
    )
  }
  