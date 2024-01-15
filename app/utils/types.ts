type UserDto = {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date | null,
    role: string,
    banned: boolean
}

type UserUpdateDto = {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
}

type IdDto = {
    id: number
}

type TokenRequestDto = {
    username: string,
    password: string
}

type TokenResponseDto = {
    token: string
}

type ClientCreateDto = {
    username: string,
    password: string,
    email: string,
    dateOfBirth: Date | null,
    firstName: string,
    lastName: string,
}

type ManagerCreateDto = {
    username: string,
    password: string,
    email: string,
    dateOfBirth: Date | null,
    firstName: string,
    lastName: string,
    gymName: string,
}

type GymManagerCreateDto = {
    username: string,
    password: string,
    email: string,
    dateOfBirth: Date | null,
    firstName: string,
    lastName: string,
    gymName: string
}

type ResetPasswordDto = {
    oldPassword: string,
    newPassword: string
}

type FilterDto = {
    trainingTypes: string | null;
    isIndividual: number | null;
    dayOfWeek: string | null;
}

type AppointmentDto = {
    id: number,
    date: Date,
    start: string,
    end: string,
    maxPeople: number,
    availablePlaces: number,
    gymId: number,
    gymName: string,
    trainingTypeName: string,
    trainingTypeId: number,
    cena: number,
}

type TrainingTypeDto = {
    id: number,
    name: string;
    isIndividual: boolean;
}

type BannedUserDto = {
    id: number
}

type GymUpdateDto = {
    name: string;
    description: string;
    numOfPersonalCoaches: number;
}

type GymDto = {
    id: number;
    name: string;
    description: string;
    numOfPersonalCoaches: number
}