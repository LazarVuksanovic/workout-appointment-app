"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { getAllGyms } from "../utils/methods";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const[gyms, setGyms] = useState<Array<GymDto>>([])
  const router = useRouter();
  useEffect(() => {
    const fetchData = () => {
      axios.all([getAllGyms(), getUserData()])
      .then(
        axios.spread((...allData) => {
          setGyms(allData[0])
          setUserData(allData[1])
        })
      )
    }

    fetchData();
  }, []);
  

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
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Naziv</p>
          <p className="font-bold w-[20%]">Broj trenera</p>
          <p className="font-bold w-[60%]">Opis</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
        {gyms.map((g:GymDto) => {
          return (
            <div className='flex items-center p-4 border-2 rounded-lg' key={g.id}>
              <p className="w-[20%]">{g.name}</p>
              <p className="w-[20%]">{g.numOfPersonalCoaches}</p>
              <p className="w-[60%]">{g.description}</p>
              <button className="btn bg-yellow-400 hover:bg-yellow-300" onClick={() => handleEdit(g.id)}>Edit</button>
            </div>
          )
        })}
      </div>
    </main>
  )
}
