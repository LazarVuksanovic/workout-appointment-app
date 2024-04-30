"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { cancelUserAppointment, getAllGymAppointments, getAllGyms, getGymByName, getUserMessages, makeAvailableAgain } from "../utils/apicalls";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import NotLoggedIn from "../components/NotLoggedIn";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

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
    return <NotLoggedIn/>
  else if(userData.role != "gymmanager")
    return <p>Zabranjen pristup</p>

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

      <Table aria-label="Tabela teretana">
        <TableHeader>
          <TableColumn className="font-bold w-[20%]">Naziv</TableColumn>
          <TableColumn>Broj trenera</TableColumn>
          <TableColumn>Opis</TableColumn>
          <TableColumn>Edit</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema teretana."}>
          {gym && <TableRow key={gym.id}>
            <TableCell className="w-[20%]">{gym.name}</TableCell>
            <TableCell className="w-[20%]">{gym.numOfPersonalCoaches}</TableCell>
            <TableCell className="w-[45%]">{gym.description}</TableCell>
            <TableCell>
              <Link href={"/edit-gym/edit-training-types"} className="btn mr-2 text-nowrap">Tipovi treninga</Link>
              <button className="btn bg-yellow-400 hover:bg-yellow-300" onClick={() => handleEdit(gym.id)}>Edit</button>
            </TableCell>
          </TableRow>}
        </TableBody>
      </Table>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Zakazani termini</h2>
      </div>
      <Table aria-label="Tabela zakazanih treninga">
        <TableHeader>
          <TableColumn>Tip treninga</TableColumn>
          <TableColumn>Teretana</TableColumn>
          <TableColumn>Vreme</TableColumn>
          <TableColumn>Datum</TableColumn>
          <TableColumn>Slobodna mesta</TableColumn>
          <TableColumn>Cena</TableColumn>
          <TableColumn>Otkaži</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema zakazanih termina."}>
        {gymAppointments && gymAppointments.map((a:any) => {
            return (
              <TableRow key={a.id}>
                <TableCell>{a.trainingTypeName}</TableCell>
                <TableCell>{a.gymName}</TableCell>
                <TableCell>{`${a.start}h - ${a.end}h`}</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell>{a.availablePlaces}</TableCell>
                <TableCell>{a.price} din.</TableCell>
                <TableCell>
                  {a.availablePlaces >= 0 ? (
                      <button className="btn bg-red-400 hover:bg-red-300" id={a.id} onClick={() => handleCancel(a.id)}>Otkaži</button>
                    ) : (
                      <button className="btn" id={a.id} onClick={() => handleMakeAvailable(a.id)}>Omogući</button>
                    )}
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
     {/* <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
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
            <p className="w-[20%]">{`${a.start}h - ${a.end}h`}</p>
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
      </div> */}