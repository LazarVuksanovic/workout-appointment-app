"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { banUser, getAllMessages, getAllUsers, unbanUser } from "../utils/methods";
import Link from "next/link";
import axios from "axios";


export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const[users, setUsers] = useState<Array<UserDto>>([])
  const[messages, setMessages] = useState<Array<any>>([])

  useEffect(() => {
    const fetchData = () => {
      axios.all([getAllUsers(), getAllMessages(), getUserData()])
      .then(
        axios.spread((...allData) => {
          setUsers(allData[0])
          setMessages(allData[1])
          setUserData(allData[2])
        })
      )
    }

    fetchData();
  }, []);
  

  const handleBan = async (id:number) => {
    await banUser(id);
    const t = await getAllUsers();
    setUsers(t);
  }

  const handleUnban = async (id:number) => {
    await unbanUser(id);
    const t = await getAllUsers();
    setUsers(t);
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "admin")
    return <p>Zabranjen pristup</p>

  console.log(messages)
  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Admin panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista korisnika</h2>
        <div className="flex gap-4">
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
          <Link href={"/"} className="btn">Početna</Link>
        </div>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[17%]">Username</p>
          <p className="font-bold w-[17%]">Email</p>
          <p className="font-bold w-[17%]">Ime i Prezime</p>
          <p className="font-bold w-[14%]">Datum rođenja</p>
          <p className="font-bold w-[20%]">Scheduled appointments</p>
          <p className="font-bold w-[17%]">Uloga</p>
          <p className="font-bold w-[17%]">Verified</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
        {users.map((u:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={u.id}>
              <p className="w-[17%]">{u.username}</p>
              <p className="w-[17%]">{u.email}</p>
              <p className="w-[17%]">{u.firstName} {u.lastName}</p>
              <p className="w-[17%]">{u.dateOfBirth}</p>
              <p className="w-[17%]">{u.scheduledAppointments}</p> 
              <p className="w-[17%]">{u.role}</p>
              <p className="w-[17%]">{u.verified.toString()}</p>
              {u.role != "admin" ? (
                u.banned ?  (
                  <button className="btn" onClick={() => handleUnban(u.id)}>Unban</button>
                  ) : (
                    <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleBan(u.id)}>Ban</button>
                  )
              ) : (
                <p className="px-4 py-2 bg-transparent text-transparent select-none">ban</p>
              )}
          </div>
          )
        })}
      </div>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Lista poruka</h2>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[25%]">Time sent</p>
          <p className="font-bold w-[20%]">Send to</p>
          <p className="font-bold w-[35%]">Message</p>
          <p className="font-bold w-[20%]">Message type</p>
        </div>
        {messages.map((m:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={m.id}>
              <p className="w-[25%]">{m.timeSent}</p>
              <p className="w-[20%]">{m.email}</p>
              <p className="w-[35%]">{m.text}</p>
              <p className="w-[20%]">{m.messageType.messageType}</p>
          </div>
          )
        })}
      </div>
    </main>
  )
}
