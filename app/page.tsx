"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "./utils/contexts/Context"
import { cancelUserAppointment, getUserAppointments, getUserMessages } from "./utils/apicalls";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [appointments, setAppointments] = useState<Array<AppointmentDto>>([]);
  const [messages, setMessages] = useState<Array<any>>([])
  const router = useRouter();
  useEffect(() => {
    const fetchData = () => {
      axios.all([getUserAppointments(), getUserData(),])
      .then(
        axios.spread((...allData) => {
          setAppointments(allData[0])
          setUserData(allData[1])
        })
      )
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const m = await getUserMessages(userData?.id)
      setMessages(m)
    }
    fetchMessages()
  }, [userData])

  const handleCancel = async (appointmentId:number) => {
    try {
      await cancelUserAppointment(userData, appointmentId);
      const userAppointments = await getUserAppointments();
      
      setAppointments(userAppointments);
    } catch (error) {
      console.error(error);
    }
  };

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role == "admin")
    router.push("/admin-panel")
  else if(userData.role == "gymmanager")
    router.push("/manager-panel")

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Welcome, {userData?.username}!</h1>
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Zakazani treninzi</h2>
        <div className="flex gap-4">
          {userData.role == "client" && <Link href={"/available-appointments"} className="btn">Zakaži novi termin</Link>}
          <Link href={"/edit-profile"} className="btn bg-yellow-400 hover:bg-yellow-300">Edit Profil</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[25%]">Tip treninga</p>
          <p className="font-bold w-[25%]">Teretana</p>
          <p className="font-bold w-[25%]">Vreme</p>
          <p className="font-bold w-[25%]">Datum</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Otkaži</p>
        </div>
        {appointments.map((a:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={a.id}>
              <p className="w-[25%]">{a.trainingTypeName}</p>
              <p className="w-[25%]">{a.gymName}</p>
              <p className="w-[25%]">{a.start}h - {a.end}h</p>
              <p className="w-[25%]">{a.date}</p>
              <button className="btn bg-red-400 hover:bg-red-300" id={a.id} onClick={() => handleCancel(a.id)}>Otkaži</button>
          </div>
          )
        })}
      </div>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Poruke</h2>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[25%]">Time sent</p>
          <p className="font-bold w-[20%]">Send to</p>
          <p className="font-bold w-[35%]">Message</p>
          <p className="font-bold w-[20%]">Message type</p>
        </div>
        {messages && messages.map((m:any) => {
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
