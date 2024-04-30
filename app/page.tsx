"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "./utils/contexts/Context"
import { cancelUserAppointment, getUserAppointments, getUserMessages } from "./utils/apicalls";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import NotLoggedIn from "./components/NotLoggedIn";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

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
      const m = await getUserMessages(userData?.id)
      setMessages(m)
    } catch (error) {
      console.error(error);
    }
  };

  if(token == null || token == '')
    return <NotLoggedIn/>
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
      <Table aria-label="Tabela zakazanih treninga">
        <TableHeader>
          <TableColumn>Tip treninga</TableColumn>
          <TableColumn>Teretana</TableColumn>
          <TableColumn>Vreme</TableColumn>
          <TableColumn>Datum</TableColumn>
          <TableColumn>Otkaži</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema zakazanih treninga."}>
          {appointments.map((a:any) => {
            return (
              <TableRow key={a.id}>
                <TableCell>{a.trainingTypeName}</TableCell>
                <TableCell>{a.gymName}</TableCell>
                <TableCell>{a.start}h - {a.end}h</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell>
                  <button className="btn bg-red-400 hover:bg-red-300" id={a.id} onClick={() => handleCancel(a.id)}>Otkaži</button>
                </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Poruke</h2>
      </div>
      <Table aria-label="Tabela primljenih poruka">
        <TableHeader>
          <TableColumn>Time sent</TableColumn>
          <TableColumn>Send to</TableColumn>
          <TableColumn>Message</TableColumn>
          <TableColumn>Message type</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema poruka."}>
        {messages && messages.map((m:any) => {
          return (
            <TableRow key={m.id}>
              <TableCell>{m.timeSent}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.text}</TableCell>
              <TableCell>{m.messageType.messageType}</TableCell>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
    </main>
  )
}
