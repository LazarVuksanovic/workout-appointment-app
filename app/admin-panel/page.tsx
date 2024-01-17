"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { banUser, deleteMessageType, editMessageType, getAllMessageTypes, getAllMessages, getAllUsers, unbanUser } from "../utils/apicalls";
import axios from "axios";
import { useRouter } from 'next/navigation';


export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [users, setUsers] = useState<Array<UserDto>>([])
  const [messages, setMessages] = useState<Array<any>>([])
  const [messageTypes, setMessageTypes] = useState<Array<any>>([])
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      axios.all([getAllUsers(), getAllMessages(), getUserData(), getAllMessageTypes()])
      .then(
        axios.spread((...allData) => {
          setUsers(allData[0])
          setMessages(allData[1])
          setUserData(allData[2])
          setMessageTypes(allData[3])
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

  const handleEdit = async (type:string, text:string) => {
    await editMessageType(type, text);
    const d = await getAllMessageTypes()
    setMessageTypes(d);
  }

  const handleDelete = async (type:string) => {
    await deleteMessageType(type)
    const d = await getAllMessageTypes()
    setMessageTypes(d);
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "admin")
    return <p>Zabranjen pristup</p>

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Admin panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista korisnika</h2>
        <div className="flex gap-4">
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[12%]">Username</p>
          <p className="font-bold w-[20%]">Email</p>
          <p className="font-bold w-[20%]">Ime i Prezime</p>
          <p className="font-bold w-[14%]">Datum rođenja</p>
          <p className="font-bold w-[20%]">Scheduled appointments</p>
          <p className="font-bold w-[17%]">Uloga</p>
          <p className="font-bold w-[10%]">Verified</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
        {users.map((u:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={u.id}>
              <p className="w-[12%]">{u.username}</p>
              <p className="w-[20%]">{u.email}</p>
              <p className="w-[20%]">{u.firstName} {u.lastName}</p>
              <p className="w-[14%]">{u.dateOfBirth}</p>
              <p className="w-[20%]">{u.scheduledAppointments}</p> 
              <p className="w-[17%]">{u.role}</p>
              <p className="w-[10%]">{u.verified.toString()}</p>
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
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
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
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Lista tipova poruka</h2>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Tip</p>
          <p className="font-bold w-[70%]">Text</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">edit</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">obrisi</p>
        </div>
        {messageTypes.map((m:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={m.messageType}>
              <p className="w-[20%]">{m.messageType}</p>
              <p className="w-[70%]">{m.text}</p>
              <button className="btn bg-yellow-400 hover:bg-yellow-300" onClick={() => router.push(`/edit-message-type/${m.messageType}`)}>Edit</button>
              <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleDelete(m.messageType)}>Obriši</button>
          </div>
          )
        })}
      </div>
    </main>
  )
}
