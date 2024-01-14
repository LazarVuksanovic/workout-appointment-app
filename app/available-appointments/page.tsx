"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { getAvailableAppointments, scheduleUserAppointment } from "../utils/methods";
import Link from "next/link";


export default function Home() {
  const {getUserData} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [appointments, setAppointments] = useState<Array<AppointmentDto>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAppointments = await getAvailableAppointments(null, null, null);
        setAppointments(userAppointments);

        const userData = await getUserData();
        setUserData(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
  const handleSchedule = async (appointmentId:number) => {
    try {
      await scheduleUserAppointment(userData, appointmentId);
      const userAppointments = await getAvailableAppointments(null, null, null);
      setAppointments(userAppointments);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Dostupni termini</h1>
      <div className="flex justify-end mb-8">
        <Link href={"/"} className="btn">Početna</Link>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 p-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Tip treninga</p>
          <p className="font-bold w-[20%]">Teretana</p>
          <p className="font-bold w-[20%]">Vreme</p>
          <p className="font-bold w-[20%]">Datum</p>
          <p className="font-bold w-[20%]">Slobodnih Mesta</p>
          <p className="btn bg-transparent text-transparent select-none">Zakazi</p>
        </div>
        {appointments.map((a:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={a.id}>
              <p className="w-[20%]">{a.trainingTypeName}</p>
              <p className="w-[20%]">{a.gymName}</p>
              <p className="w-[20%]">{a.start}h - {a.end}h</p>
              <p className="w-[20%]">{a.date}</p>
              <p className="w-[20%]">{a.availablePlaces}</p>
              <button className="btn" onClick={() => handleSchedule(a.id)}>Zakaži</button>
          </div>
          )
        })}
      </div>
    </main>
  )
}
