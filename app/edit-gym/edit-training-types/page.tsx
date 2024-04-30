"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useAppContext } from "@/app/utils/contexts/Context";
import { addGymTrainingType, getGymByName, getGymTrainingTypes, getTrainingTypes, removeGymTrainingType } from "@/app/utils/apicalls";
import {Select, SelectItem} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import NotLoggedIn from "@/app/components/NotLoggedIn";

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
    return <NotLoggedIn/>
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
      <form className='flex items-center justify-between p-4 border-2 rounded-lg mb-5'>
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
      <Table aria-label="Tabela zakazanih treninga">
        <TableHeader>
          <TableColumn>Tip treninga</TableColumn>
          <TableColumn>Cena</TableColumn>
          <TableColumn>Obriši</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema dostupnih termina."}>
          {trainingTypes && trainingTypes.map((type) => {
              return (
                <TableRow key={type.id}>
                  <TableCell>{type.trainingTypeName}</TableCell>
                  <TableCell>{type.price}</TableCell>
                  <TableCell>
                    <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleRemove(type.id)}>Obrisi</button>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </main>
  )
}
