"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { getAvailableAppointments, getTrainingTypes, scheduleUserAppointment } from "../utils/methods";
import Link from "next/link";
import Filter from "../components/Filter";
import axios from "axios";


export default function Home() {
  const {getUserData} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [appointments, setAppointments] = useState<Array<AppointmentDto>>([]);
  const [trainingTypes, setTrainingTypes] = useState<Array<TrainingTypeDto> | null>(null)
  const [filter, setFilter] = useState<FilterDto>({trainingTypes: null, isIndividual: null, dayOfWeek: null,})
  useEffect(() => {
    const fetchData = () => {
      axios.all([getAvailableAppointments(filter), getUserData(), getTrainingTypes()])
      .then(
        axios.spread((...allData) => {
          setAppointments(allData[0])
          setUserData(allData[1])
          setTrainingTypes(allData[2])
        })
      )
    }

    fetchData();
  }, []);
  
  const handleSchedule = async (appointmentId:number) => {
    try {
      await scheduleUserAppointment(userData, appointmentId);
      const userAppointments = await getAvailableAppointments(filter);
      setAppointments(userAppointments);

    } catch (error) {
      console.error(error);
    }
  };

  const submitFilter = async () => {
    console.log(filter)
    const a = await getAvailableAppointments(filter)
    setAppointments(a);
  };
  console.log(appointments)
  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Dostupni termini</h1>
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div className="w-[80%]">
          <h2 className="text-xl font-bold mb-2">Filter</h2>
          {trainingTypes && <Filter trainingTypes={trainingTypes} submitFilter={submitFilter} setFilter={setFilter} filter={filter} />}
        </div>
        <Link href={"/"} className="btn">Početna</Link>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 p-4 border-b-2 border-black'>
            <p className="font-bold w-[20%]">Tip treninga</p>
            <p className="font-bold w-[20%]">Teretana</p>
          <p className="font-bold w-[20%]">Vreme</p>
          <p className="font-bold w-[20%]">Datum</p>
          <p className="font-bold w-[20%]">Slobodnih Mesta</p>
          <p className="font-bold w-[20%]">Cena</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Zakazi</p>
        </div>
        {appointments.map((a:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={a.id}>
              <p className="w-[20%]">{a.trainingTypeName}</p>
              <p className="w-[20%]">{a.gymName}</p>
              <p className="w-[20%]">{a.start}h - {a.end}h</p>
              <p className="w-[20%]">{a.date}</p>
              <p className="w-[20%]">{a.availablePlaces}</p>
              <p className="w-[20%]">{a.price} din.</p>
              <button className="btn" onClick={() => handleSchedule(a.id)}>Zakaži</button>
          </div>
          )
        })}
      </div>
    </main>
  )
}
