"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { cancelUserAppointment, getAllGymAppointments, getAllGyms, getGymByName, getUserMessages, makeAvailableAgain } from "../utils/apicalls";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [gym, setGym] = useState<any>(null)
  const [gymAppointments, setGymAppointments] = useState<any>(null)
  const [messages, setMessages] = useState<Array<any>>([])
  const router = useRouter();
  useEffect(() => {
    const fetchData = () => {
      axios.all([getUserData()])
      .then(
        axios.spread((...allData) => {
          setUserData(allData[0])
        })
      )
    }

    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchGym = async () => {
      const d = await getGymByName(userData.gymName)
      setGym(d);
      const m = await getUserMessages(userData?.id)
      setMessages(m)
    }
    fetchGym()
  }, [userData])

  useEffect(() => {
    const fetchGymAppointments = async () => {
      const d = await getAllGymAppointments(gym?.id)
      setGymAppointments(d);
    }
    fetchGymAppointments()
  }, [gym])

  const handleEdit = async (id:number) => {
    router.push(`/edit-gym/${id}`)
  };

  const handleCancel = async (appointmentId:number) => {
    await cancelUserAppointment(userData, appointmentId);
    const userAppointments = await getAllGymAppointments(gym?.id);
    setGymAppointments(userAppointments);
  };

  const handleMakeAvailable = async (appointmentId:number) => {
    await makeAvailableAgain(appointmentId)
    const userAppointments = await getAllGymAppointments(gym?.id);
    setGymAppointments(userAppointments);
  };

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "gymmanager")
    return <p>Zabranjen pristup</p>
  console.log(gymAppointments)
  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Gym manager panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Teretana</h2>
        <div className="flex gap-4">
          <Link href={"/add-appointment"} className="btn">Dodaj novi termin</Link>
          <Link href={"/edit-profile"} className="btn bg-yellow-400 hover:bg-yellow-300">Edit Profil</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Naziv</p>
          <p className="font-bold w-[20%]">Broj trenera</p>
          <p className="font-bold w-[45%]">Opis</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
          {gym && <div className='flex items-center p-4 border-2 rounded-lg' key={gym.id}>
            <p className="w-[20%]">{gym.name}</p>
            <p className="w-[20%]">{gym.numOfPersonalCoaches}</p>
            <p className="w-[45%]">{gym.description}</p>
            <Link href={"/edit-gym/edit-training-types"} className="btn mr-2 text-nowrap">Training types</Link>
            <button className="btn bg-yellow-400 hover:bg-yellow-300" onClick={() => handleEdit(gym.id)}>Edit</button>
          </div>}
      </div>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Zakazani termini</h2>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Tip treninga</p>
          <p className="font-bold w-[20%]">Teretana</p>
          <p className="font-bold w-[20%]">Vreme</p>
          <p className="font-bold w-[20%]">Datum</p>
          <p className="font-bold w-[20%]">Slobodna mesta</p>
          <p className="font-bold w-[20%]">Cena</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Otkaži</p>
        </div>
        {gymAppointments && gymAppointments.map((a:any) => {
          return (
          <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={a.id}>
            <p className="w-[20%]">{a.trainingTypeName}</p>
            <p className="w-[20%]">{a.gymName}</p>
            <p className="w-[20%]">{a.start}h - {a.end}h</p>
            <p className="w-[20%]">{a.date}</p>
            <p className="w-[20%]">{a.availablePlaces}</p>
            <p className="w-[20%]">{a.price} din.</p>
            {a.availablePlaces >= 0 ? (
                <button className="btn bg-red-400 hover:bg-red-300" id={a.id} onClick={() => handleCancel(a.id)}>Otkaži</button>
              ) : (
                <button className="btn" id={a.id} onClick={() => handleMakeAvailable(a.id)}>Omogući</button>
              )}
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
