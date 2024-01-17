"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useAppContext } from "@/app/utils/contexts/Context";
import { addGymTrainingType, getGymByName, getGymTrainingTypes, getTrainingTypes, removeGymTrainingType } from "@/app/utils/apicalls";
import {Select, SelectItem} from "@nextui-org/react";

export default function Home() {
  const router = useRouter()
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [trainingTypes, setTrainingTypes] = useState<Array<any>>([])
  const [allTrainingTypes, setAllTrainingTypes] = useState<Array<any>>([])
  const [gym, setGym] = useState<any>()
  const [inputs, setInputs] = useState<any>({
    id: -1,
    price: 0
  })

  useEffect(() => {
    const fetchData = () => {
      axios.all([getUserData(), getTrainingTypes()])
      .then(
        axios.spread((...allData) => {
          setUserData(allData[0])
          setAllTrainingTypes(allData[1])
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
  
  const handleInputChange = (e:any) => {
    setInputs((prev:any) => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleAdd = async (e:any) => {
    e.preventDefault();
    await addGymTrainingType(gym.id, inputs)
    const t = await getGymTrainingTypes(gym?.id);
    setTrainingTypes(t)
  };

  const handleRemove = async (id:number) =>{
    await removeGymTrainingType(id)
    const t = await getGymTrainingTypes(gym?.id);
    setTrainingTypes(t)
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "gymmanager")
    return <p>Nisi menadžer teretane</p>
  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Gym manager panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista dostupnih tipova treninga</h2>
        <div className="flex gap-4">
          <Link href={"/"} className="btn">Početna</Link>
          <Link href={"/add-appointment"} className="btn">Dodaj novi termin</Link>
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <div className="flex flex-col border-2 border-black shadow-lg gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 px-4 border-b-2 border-black'>
          <p className="font-bold w-[20%]">Tip treninga</p>
          <p className="font-bold w-[80%]">Cena</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
          {trainingTypes && trainingTypes.map((type) => {
            return (
              <div className='flex items-center p-4 border-2 rounded-lg' key={type.id}>
                <p className="w-[20%]">{type.trainingTypeName}</p>
                <p className="w-[80%]">{type.price}</p>
                <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleRemove(type.id)}>Obrisi</button>
              </div>
            )
          })}
          <form className='flex items-center justify-between p-4 border-2 rounded-lg'>
            <div className="flex gap-5 w-[90%]">
              {allTrainingTypes && <Select onChange={handleInputChange} name="id" size="sm" label="Tip Treninga" className="max-w-xs">
                {allTrainingTypes.map((type: TrainingTypeDto) => (
                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                ))}
              </Select>}
              <input onChange={handleInputChange} min={1} type="number" name='price' id="price" className="input" placeholder="cena"></input>
            </div>
            <button className="btn" onClick={handleAdd}>Dodaj novi</button>
          </form>
      </div>
    </main>
  )
}
