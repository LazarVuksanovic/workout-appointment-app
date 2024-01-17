"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "../../utils/contexts/Context";
import { editMessageType, editUser, getMessageTypeInfo } from "../../utils/apicalls";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function Home() {
    const {getUserData} = useAppContext();
    const [userData, setUserData] = useState<any>(null);
    const [text, setText] = useState<any>(null);
    const [messageType, setMessageType] = useState<any>();
    const params = useParams<{ id: string }>()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
          const data = await getMessageTypeInfo(params.id);
          setMessageType(data)
        }
    
        fetchData();
    }, []);

    useEffect(() => {
        setText(messageType?.text)
    },[messageType]);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    };

    const handleUpdate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await editMessageType(messageType.messageType, text);
        router.push("/admin-panel");
    }

    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Promena teksta poruke</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleUpdate}>
                <div className="flex flex-col">
                    <label htmlFor="text">Text</label>
                    <input onChange={handleInputChange} type="text" name='text' id="text" className="input" placeholder={messageType?.text}></input>
                </div>
                <button className="btn">Save</button>
            </form>
        </div>
      </main>
    )
  }
  