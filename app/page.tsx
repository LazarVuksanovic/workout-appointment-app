"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "./utils/contexts/Context"
import { cancelUserAppointment, getUserAppointments } from "./utils/methods";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [appointments, setAppointments] = useState<Array<AppointmentDto>>([]);

  useEffect(() => {
    const fetchData = () => {
      axios.all([getUserAppointments(), getUserData()])
      .then(
        axios.spread((...allData) => {
          setAppointments(allData[0])
          setUserData(allData[1])
        })
      )
    }

    fetchData();
  }, []);

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

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Dobro došao, {userData?.username}!</h1>
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Zakazani treninzi</h2>
        <div className="flex gap-4">
          <Link href={"/available-appointments"} className="btn">Zakaži novi termin</Link>
          {userData.role == "admin" && <Link href={"/admin-panel"} className="btn bg-yellow-400 hover:bg-yellow-300">Admin panel</Link>}
          {userData.role == "gymmanager" && <Link href={"/manager-panel"} className="btn bg-yellow-400 hover:bg-yellow-300">Manager panel</Link>}
          <Link href={"/edit-profile"} className="btn bg-yellow-400 hover:bg-yellow-300">Edit Profil</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
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
    </main>
  )
}
