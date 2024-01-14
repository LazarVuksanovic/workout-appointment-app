import { createContext, SetStateAction, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";


type ContextType = {
    token: any;
    logIn: (inputs:TokenRequestDto) => void;
    logOut: () => void;
    getUserData: () => any;
}

export const Context = createContext<ContextType>({
    token: null,
    logIn: () => {},
    logOut: () => {},
    getUserData: () => {},
});

const ContextProvider = ({children}: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [userData, setUserData] = useState<UserDto | null>(null)
    const router = useRouter();

    const USER_URL = "http://localhost:8080/api"

    useEffect(() => {
        const tokenCheck = async () => {
            if(localStorage.getItem("token") || localStorage.getItem("token") != ''){
                setToken(localStorage.getItem("token"));
                const data = await getUserData();
                setUserData(data);
                console.log("setovao iz locala");
            }
            else{
                router.push("/login")
            }
        }
        //tokenCheck();
        setToken('');
    }, []);
    
    const logIn = async (inputs:TokenRequestDto) => {
        if(token != '')
            return;
        try{
            const res = await axios.post(`${USER_URL}/user/login`, inputs, {
                headers: {'Content-Type': 'application/json'},
            })
            setToken(res.data.token)
            localStorage.setItem("token", res.data.token)
            const data = await getUserData();
            setUserData(data)
            router.push("/");
        }
       catch(error){
        console.error(error);
       }
    };

    const logOut = () => {
        localStorage.removeItem("token");  
        setToken(null);
        setUserData(null)
    };

    const getUserData = async () => {
        if(userData)
            return userData;
        try{
            const res = await axios.get(`${USER_URL}/user/id`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            return res.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    return(
        <Context.Provider value={{
            token,
            logIn,
            logOut,
            getUserData,
        }}>
            {children}
        </Context.Provider>
    );
};

const useAppContext = () => {
    const context = useContext(Context);
    if(context === undefined){
        throw new Error("useUser must be used within a UserProvider")
    }
    return context;
};

export {ContextProvider, useAppContext };