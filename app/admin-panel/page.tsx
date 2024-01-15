"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { banUser, getAllUsers, getAvailableAppointments, getTrainingTypes, scheduleUserAppointment, unbanUser } from "../utils/methods";
import Link from "next/link";
import Filter from "../components/Filter";
import axios from "axios";


export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const[users, setUsers] = useState<Array<UserDto>>([])

  useEffect(() => {
    const fetchData = () => {
      axios.all([getAllUsers(), getUserData()])
      .then(
        axios.spread((...allData) => {
          setUsers(allData[0])
          setUserData(allData[1])
        })
      )
    }

    fetchData();
  }, []);
  

  const handleBan = async (id:number) => {
    await banUser(id);
    const t = await getAllUsers();
    setUsers(t);
  }

  const handleUnban = async (id:number) => {
    await unbanUser(id);
    const t = await getAllUsers();
    setUsers(t);
  }

  if(token == null || token == '')
    return <p>Moras da se login-ujes</p>
  else if(userData.role != "admin")
    return <p>Zabranjen pristup</p>

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Admin panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista korisnika</h2>
        <div className="flex gap-4">
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
          <Link href={"/"} className="btn">Početna</Link>
        </div>
      </div>
      <div className="flex flex-col  border-4 border-cyan-400 border-dashed gap-4 rounded-xl p-10 grow-0">
        <div className='flex justify-left mx-4 p-4 border-b-2 border-black'>
            <p className="font-bold w-[20%]">Username</p>
            <p className="font-bold w-[20%]">Email</p>
          <p className="font-bold w-[20%]">Ime i Prezime</p>
          <p className="font-bold w-[20%]">Datum rođenja</p>
          <p className="font-bold w-[20%]">Uloga</p>
          <p className="px-4 py-2 bg-transparent text-transparent select-none">Ban</p>
        </div>
        {users.map((u:any) => {
          return (
            <div className='flex justify-between items-center p-4 border-2 rounded-lg' key={u.id}>
              <p className="w-[20%]">{u.username}</p>
              <p className="w-[20%]">{u.email}</p>
              <p className="w-[20%]">{u.firstName} {u.lastName}</p>
              <p className="w-[20%]">{u.dateOfBirth}</p>
              <p className="w-[20%]">{u.role}</p>
              {u.role != "admin" ? (
                u.banned ?  (
                  <button className="btn" onClick={() => handleUnban(u.id)}>Unban</button>
                  ) : (
                    <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleBan(u.id)}>Ban</button>
                  )
              ) : (
                <p className="px-4 py-2 bg-transparent text-transparent select-none">bann</p>
              )}
          </div>
          )
        })}
      </div>
    </main>
  )
}
