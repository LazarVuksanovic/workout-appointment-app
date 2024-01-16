"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { getAllGyms, getGymByName } from "../utils/methods";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const[gym, setGym] = useState<any>(null)
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
    }
    fetchGym()
  }, [userData])

  const handleEdit = async (id:number) => {
    router.push(`/edit-gym/${id}`)
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "gymmanager")
    return <p>Zabranjen pristup</p>

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Gym manager panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista teretana</h2>
        <div className="flex gap-4">
          <Link href={"/"} className="btn">Početna</Link>
          <Link href={"/add-appointment"} className="btn">Dodaj novi termin</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
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
    </main>
  )
}
