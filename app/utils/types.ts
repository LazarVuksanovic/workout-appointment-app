type UserDto = {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date
    role: string
}

type UserUpdateDto = {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    gymName: string,
    employmentDate: Date
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

type GymManagerCreateDto = {
    username: string,
    password: string,
    email: string,
    dateOfBirth: Date | null,
    firstName: string,
    lastName: string,
    gymName: string
}

type ChangePasswordInputs = {
    oldPassword: string,
    newPassword: string
}

type FilterDto = {
    TrainingTypeId: Array<number> | null;
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
}