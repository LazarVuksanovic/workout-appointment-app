"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { getAvailableAppointments, getTrainingTypes, scheduleUserAppointment } from "../utils/apicalls";
import Link from "next/link";
import Filter from "../components/Filter";
import axios from "axios";
import NotLoggedIn from "../components/NotLoggedIn";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
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
    const a = await getAvailableAppointments(filter)
    setAppointments(a);
  };

  if(token == null || token == '')
    return <NotLoggedIn/>

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Dostupni termini</h1>
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div className="w-[80%]">
          <h2 className="text-xl font-bold mb-2">Filter</h2>
          {trainingTypes && <Filter trainingTypes={trainingTypes} submitFilter={submitFilter} setFilter={setFilter} filter={filter} />}
        </div>
        <div className="flex gap-4">
          <Link href={"/"} className="btn">Početna</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <Table aria-label="Tabela zakazanih treninga">
        <TableHeader>
          <TableColumn>Tip treninga</TableColumn>
          <TableColumn>Teretana</TableColumn>
          <TableColumn>Vreme</TableColumn>
          <TableColumn>Datum</TableColumn>
          <TableColumn>Slobodnih Mesta</TableColumn>
          <TableColumn>Cena</TableColumn>
          <TableColumn>Zakazi</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema dostupnih termina."}>
          {appointments.map((a:any) => {
            return (
              <TableRow key={a.id}>
                <TableCell>{a.trainingTypeName}</TableCell>
                <TableCell>{a.gymName}</TableCell>
                <TableCell>{a.start}h - {a.end}h</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell>{a.availablePlaces}</TableCell>
                <TableCell>{a.price} din.</TableCell>
                <TableCell>
                  <button className="btn" onClick={() => handleSchedule(a.id)}>Zakaži</button>
                </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </main>
  )
}
