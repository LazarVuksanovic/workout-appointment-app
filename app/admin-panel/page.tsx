"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../utils/contexts/Context";
import { banUser, deleteMessageType, editMessageType, getAllMessageTypes, getAllMessages, getAllUsers, unbanUser } from "../utils/apicalls";
import axios from "axios";
import { useRouter } from 'next/navigation';
import NotLoggedIn from "../components/NotLoggedIn";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function Home() {
  const {getUserData, logOut, token} = useAppContext();
  const [userData, setUserData] = useState<any>({});
  const [users, setUsers] = useState<Array<UserDto>>([])
  const [messages, setMessages] = useState<Array<any>>([])
  const [messageTypes, setMessageTypes] = useState<Array<any>>([])
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      axios.all([getAllUsers(), getAllMessages(), getUserData(), getAllMessageTypes()])
      .then(
        axios.spread((...allData) => {
          setUsers(allData[0])
          setMessages(allData[1])
          setUserData(allData[2])
          setMessageTypes(allData[3])
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

  const handleEdit = async (type:string, text:string) => {
    await editMessageType(type, text);
    const d = await getAllMessageTypes()
    setMessageTypes(d);
  }

  const handleDelete = async (type:string) => {
    await deleteMessageType(type)
    const d = await getAllMessageTypes()
    setMessageTypes(d);
  }

  if(token == null || token == '')
    return <NotLoggedIn/>
  else if(userData.role != "admin")
    return <p>Zabranjen pristup</p>

  return (
    <main className="flex flex-col min-h-screen items-left p-24">
      <h1 className='text-3xl mb-16 font-medium'>Admin panel</h1> 
      <div className="flex justify-between mb-8">
        <h2 className='text-xl'>Lista korisnika</h2>
        <div className="flex gap-4">
          {userData && <button className="btn bg-red-400 hover:bg-red-300" onClick={logOut}>Logout</button>}
        </div>
      </div>
      <Table aria-label="Tabela primljenih poruka">
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Ime i Prezime</TableColumn>
          <TableColumn>Datum rođenja</TableColumn>
          <TableColumn>Scheduled appointments</TableColumn>
          <TableColumn>Uloga</TableColumn>
          <TableColumn>Verified</TableColumn>
          <TableColumn>Ban</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema poruka."}>
          {users.map((u:any) => {
            return (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.firstName} {u.lastName}</TableCell>
                <TableCell>{u.dateOfBirth}</TableCell>
                <TableCell>{u.scheduledAppointments}</TableCell> 
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.verified.toString()}</TableCell>
                <TableCell>
                  {u.role != "admin" ? (
                    u.banned ?  (
                      <button className="btn" onClick={() => handleUnban(u.id)}>Unban</button>
                      ) : (
                        <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleBan(u.id)}>Ban</button>
                      )
                  ) : (
                    <p className="px-4 py-2 bg-transparent text-transparent select-none">ban</p>
                  )}
                </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Lista poruka</h2>
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
      <div className="flex justify-between mb-8 mt-16">
        <h2 className='text-xl'>Lista tipova poruka</h2>
      </div>
      <Table aria-label="Tabela primljenih poruka">
        <TableHeader>
          <TableColumn>Type</TableColumn>
          <TableColumn>Text</TableColumn>
          <TableColumn>Edit</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Nema poruka."}>
        {messageTypes.map((m:any) => {
          return (
            <TableRow key={m.id}>
              <TableCell>{m.messageType}</TableCell>
              <TableCell>{m.text}</TableCell>
              <TableCell className="flex gap-2">
                <button className="btn bg-yellow-400 hover:bg-yellow-300" onClick={() => router.push(`/edit-message-type/${m.messageType}`)}>Edit</button>
                <button className="btn bg-red-400 hover:bg-red-300" onClick={() => handleDelete(m.messageType)}>Obriši</button>
              </TableCell>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
    </main>
  )
}
