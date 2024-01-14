"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "./utils/contexts/Context"
import { cancelUserAppointment, getUserAppointments } from "./utils/methods";
import Link from "next/link";

export default function Home() {
  const {getUserData, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [appointments, setAppointments] = useState<Array<AppointmentDto>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAppointments = await getUserAppointments();
        setAppointments(userAppointments);

        const userData = await getUserData();
        setUserData(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  console.log(appointments)

  const handleCancel = async (appointmentId:number) => {
    try {
      await cancelUserAppointment(userData, appointmentId);
      const userAppointments = await getUserAppointments();
      
      setAppointments(userAppointments);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Dobro došao, {userData?.username}!</h1>
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Zakazani treninzi</h2>
        <Link href={"/available-appointments"} className="btn">Zakazi novi termin</Link>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 p-4 border-b-2 border-black'>
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
              <button className="btn bg-red-400" id={a.id} onClick={() => handleCancel(a.id)}>Otkaži</button>
          </div>
          )
        })}
      </div>
    </main>
  )
}
