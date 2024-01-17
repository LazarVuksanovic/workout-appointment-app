"use client"
import { useAppContext } from "@/app/utils/contexts/Context";
import { changePassword } from "@/app/utils/apicalls";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const {getUserData} = useAppContext();
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();
    const [inputs, setInputs] = useState<ResetPasswordDto>({
        oldPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        const fetchData = async () => {
          const data = await getUserData();
          setUserData(data)
        }
    
        fetchData();
    }, []);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev:any) => ({...prev, [e.target.name]: e.target.value}))
    };

    const handleChangePassword = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await changePassword(inputs)
        router.push("/edit-profile");
    }
    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Change password</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleChangePassword}>
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
  