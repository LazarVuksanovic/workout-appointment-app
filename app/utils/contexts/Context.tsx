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

    // const USER_URL = "http://localhost:8080/api"
    const USER_URL = "http://localhost:7777/user-service/api"

    useEffect(() => {
        const fetchData = async () => {
            if(localStorage.getItem("token") != null && localStorage.getItem("token") != '')
                setToken(localStorage.getItem("token"))
        }
        fetchData();
    }, []);
    
    const logIn = async (inputs:TokenRequestDto) => {
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
        router.push("/login")
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