import axios from "axios";

const APPOINTMENT_URL = "http://localhost:8081/api"
const MESSAGE_URL = "http://localhost:8082/api"
const USER_URL = "http://localhost:8080/api"

export const registerClient = async (inputs:ClientCreateDto) => {
    try{
        const res = await axios.post(`${USER_URL}/user/client`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const registerManager = async (inputs:ManagerCreateDto) => {
    try{
        const res = await axios.post(`${USER_URL}/user/gymmanager`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const getAvailableAppointments = async (filter:FilterDto) => {
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

export const getGymInfo = async (id:any) => {
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

export const getTrainingTypeInfo = async (id:any, token:number) => {
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

export const getGymTrainingTypeInfo = async (gymId:number, typeId:number) => {
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/training-type/price/${gymId}/${typeId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
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

export const getTrainingTypes = async () => {
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/training-type/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content;
    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAllUsers = async () => {
    try{
        const res = await axios.get(`${USER_URL}/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content
    }catch(error){
        console.log(error)
        //throw error;
    }
}

export const banUser = async (id:number) => {
    const user:BannedUserDto = {
        id: id
    }
    try{
        const res = await axios.post(`${USER_URL}/user/ban`, user, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const unbanUser = async (id:number) => {
    const user:BannedUserDto = {
        id: id
    }
    try{
        const res = await axios.post(`${USER_URL}/user/unban`, user, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const editUser = async (inputs:UserUpdateDto) => {
    try{
        const res = await axios.post(`${USER_URL}/user/edit`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const changePassword = async (inputs:ResetPasswordDto) => {
    try{
        const res = await axios.post(`${USER_URL}/user/reset-password`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const editGym = async (id:number, inputs:GymUpdateDto) => {
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/gym/${id}/edit`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const getAllGyms = async () => {
    try{
        const res = await  axios.get(`${APPOINTMENT_URL}/gym`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content

    }catch(error){
        console.log(error)
        throw error;
    }
}

export const getGymByName = async (name:string) => {
    if(name == undefined)
        return null
    const n:any = {
        gymName: name
    }
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/gym/name/`, n, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const verifyEmail = async (verificationToken:string) => {
    try{
        const res = await axios.post(`${USER_URL}/user/email-verification/${verificationToken}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const getAllMessages = async () => {
    try{
        const res = await axios.get(`${MESSAGE_URL}/message`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content
    }catch(error){
        console.log(error)
        throw error
    }
}

export const addAppointment = async (inputs:any, gymId:number, availablePlaces:number) => {
    inputs.gymId = gymId;
    inputs.availablePlaces = availablePlaces;
    console.log(inputs)
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/appointment/add`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data
    }catch(error){
        console.log(error)
        throw error
    }
}

export const getGymTrainingTypes = async (gymId:number) => {
    if(gymId == undefined)
        return
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/gym/${gymId}/training-types`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content
    }catch(error){
        console.log(error)
        throw error
    }
}

export const removeGymTrainingType = async (id:number) => {
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/gym/remove-training-type/${id}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const addGymTrainingType = async (gymId:number, inputs:any) => {
    try{
        const res = await axios.post(`${APPOINTMENT_URL}/gym/${gymId}/add-training-type`, inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const getAllGymAppointments = async (gymId:number) => {
    if (gymId == undefined)
        return
    try{
        const res = await axios.get(`${APPOINTMENT_URL}/appointment/gym-appointments/${gymId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.content;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const makeAvailableAgain = async (appointmentId:number) => {
    try{
        const res  = await axios.post(`${APPOINTMENT_URL}/appointment/make-available/${appointmentId}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export const updateManagerGymName = async (name:string) => {
    const n = {
        gymName: name
    }
    try{
        const res  = await axios.post(`${USER_URL}/user/gymmanager/gym-name`, n, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data;
    }catch(error){
        console.log(error)
        throw error;
    }
}