"use client"
import { useEffect, useState } from "react";
import { useAppContext } from "../../utils/contexts/Context";
import { editGym, getGymInfo } from "../../utils/methods";
import axios from "axios";
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function Home() {
    const {getUserData} = useAppContext();
    const [userData, setUserData] = useState<any>(null);
    const [gymData, setGymData] = useState<any>(null);
    const params = useParams<{ id: string }>()
    const router = useRouter();
    const [inputs, setInputs] = useState<GymUpdateDto>({
        name: '',
        description: '',
        numOfPersonalCoaches: 0
    });

    useEffect(() => {
        const fetchData = () => {
          axios.all([getGymInfo(params.id),])
          .then(
            axios.spread((...allData) => {
                setGymData(allData[0])
                //setUserData(allData[1])
            })
          )
        }
    
        fetchData();
      }, []);

    useEffect(() => {
        setInputs({
            name: gymData?.name,
            description: gymData?.description,
            numOfPersonalCoaches: gymData?.numOfPersonalCoaches
        });
    },[gymData]);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev:any) => ({...prev, [e.target.name]: e.target.value}))
    };

    const handleUpdate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await editGym(Number.parseInt(params.id), inputs);
        router.push("/manager-panel");
    }

    return (
      <main className="flex flex-col min-h-screen items-center p-8 space-y-16">
        <div className="flex flex-col border-2 items-center p-10 rounded-xl">
            <h1 className="text-3xl mb-10">Edit gym</h1>
            <form className="flex flex-col space-y-10 items-left" onSubmit={handleUpdate}>
                <div className="flex flex-col">
                    <label htmlFor="name">Name</label>
                    <input onChange={handleInputChange} type="text" name='name' id="name" className="input" placeholder={gymData?.name ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="numOfPersonalCoaches">Number of personal coaches</label>
                    <input onChange={handleInputChange} type="text" name='numOfPersonalCoaches' id="numOfPersonalCoaches" className="input" placeholder={gymData?.numOfPersonalCoaches ?? ''}></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description">Description</label>
                    <input onChange={handleInputChange} type="text" name='description' id="description" className="input" placeholder={gymData?.description ?? ''}></input>
                </div>
                <button className="btn">Save</button>
            </form>
        </div>
      </main>
    )
  }
  