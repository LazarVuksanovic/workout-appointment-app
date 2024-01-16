"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { addAppointment, getGymByName, getGymTrainingTypes } from "../utils/methods";
import Link from "next/link";
import {Select, SelectItem} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [trainingTypes, setTrainingTypes] = useState<Array<any>>([])
  const [gym, setGym] = useState<any>()
  const [inputs, setInputs] = useState<any>({
    maxPeople: 0,
    start: null,
    end: null,
    date: null,
  })

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
    }
    fetchGym()
  }, [userData])

  useEffect(() => {
    const fetchTypes = async () => {
      const t = await getGymTrainingTypes(gym?.id)
      setTrainingTypes(t)
    }
    fetchTypes()
  }, [gym])
  
  const handleAdd = async () => {
    //setInputs((prev:any) => ({...prev, ["gymId"]: gym.id}))
    await addAppointment(inputs, gym.id, inputs.maxPeople);
    router.push("/manager-panel")
  };

  const handleInputChange = (e:any) =>{
    setInputs((prev:any) => ({...prev, [e.target.name]: e.target.value}))
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "gymmanager")
    return <p>Nisi menadžer teretane</p>
    
  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Napravi novi termin u teretani <span className="text-cyan-500">{gym?.name}</span></h1>
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div className="flex w-[100%] justify-end gap-4">
          <Link href={"/"} className="btn">Početna</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col mx-20 space-y-10 items-left">
        <div className="flex flex-col">
          <label>Tip Treninga</label>
          {trainingTypes && <Select name="gymTrainingTypeId" selectedKeys={''} size="sm" label="Tip Treninga" className="max-w-xs" onChange={handleInputChange} >
            {trainingTypes.map((type:any) => (
                <SelectItem key={Number.parseInt(type.id)} value={type.name}>{`${type.trainingTypeName}, cena: ${type.price}`}</SelectItem>
            ))}
          </Select>}
        </div>
        <div className="flex flex-col">
            <label htmlFor="maxPeople">Broj Mesta</label>
            <input onChange={handleInputChange} type="number" min={1} name='maxPeople' id="maxPeople" className="input" ></input>
        </div>
        <div className="flex flex-col">
            <label htmlFor="date">Datum</label>
            <input onChange={handleInputChange} type="date" name='date' id="date" className="input" ></input>
        </div>
        <div className="flex flex-col">
            <label htmlFor="start">Početak</label>
            <input onChange={handleInputChange} type="time" name='start' id="start" className="input" ></input>
        </div>
        <div className="flex flex-col">
            <label htmlFor="end">Kraj</label>
            <input onChange={handleInputChange} type="time" name='end' id="end" className="input" ></input>
        </div>
        <button className="btn" onClick={handleAdd}>Dodaj</button>
      </div>
    </main>
  )
}
