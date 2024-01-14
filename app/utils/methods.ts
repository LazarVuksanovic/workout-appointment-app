import axios from "axios";

const APPOINTMENT_URL = "http://localhost:8081/api"
const MESSAGE_URL = "http://localhost:8082/api"

export const getAvailableAppointments = async (TrainingTypeId: Array<number> | null,
                                                isIndividual: number | null,
                                                dayOfWeek: string | null) => {
    const filter:FilterDto = {
        TrainingTypeId: TrainingTypeId,
        isIndividual: isIndividual,
        dayOfWeek: dayOfWeek
    }

    try {
        const response = await axios.post(`${APPOINTMENT_URL}/appointment/`,filter, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data.content;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserAppointments = async () => {
    try {
        const response = await axios.get(`${APPOINTMENT_URL}/appointment/user-appointments`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data.content;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getGymInfo = async (id:number) => {
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/gym/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
        return res.data;
    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const getTrainingTypeInfo = async (id:number, token:number) => {
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/training-type/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        return res.data;
    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const cancelUserAppointment = async (userData:UserDto|null, appointmentId:number) => {
    if(userData == null)
        return;

    const id:IdDto = {
        id: appointmentId
    }
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/appointment/cancel`,id , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const scheduleUserAppointment = async (userData:UserDto|null, appointmentId:number) => {
    if(userData == null)
        return;

    const id:IdDto = {
        id: appointmentId
    }
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/appointment/schedule`,id , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch (error) {
        console.error(error);
        throw error;
    }
}