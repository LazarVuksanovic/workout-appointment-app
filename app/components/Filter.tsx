"use client";
import {Select, SelectItem} from "@nextui-org/react";
import React, { Dispatch, SetStateAction } from 'react';

type FilterProps = {
    trainingTypes: Array<TrainingTypeDto>,
    submitFilter:() => void,
    setFilter:Dispatch<SetStateAction<FilterDto>>,
    filter:FilterDto
};

const Filter: React.FC<FilterProps> = ({trainingTypes, submitFilter, setFilter, filter}) => {
    
    const handleSelectionChange = (e:any) => {
        setFilter((prev) => ({...prev, [e.target.name]: e.target.value == 'null' ? null : e.target.value == "" ? null : e.target.value}));
    };

    const handleApply = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("TrainingTypeId",filter.TrainingTypeId)
        // console.log("dayOfWeek",filter.dayOfWeek)
        // console.log("isIndividual",filter.isIndividual)
        submitFilter();
    }

    return (
        <form className="flex gap-4" onSubmit={handleApply}>
            <Select name="trainingTypes" size="sm" label="Tip Treninga" selectionMode="multiple" className="max-w-xs" onChange={handleSelectionChange} >
                {trainingTypes.map((type: TrainingTypeDto) => (
                    <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                ))}
            </Select>
            <Select name="isIndividual" size="sm" label="Individualni ili Grupni" className="max-w-xs" onChange={handleSelectionChange}>
                <SelectItem key={"null"} value={"null"}>svi</SelectItem>
                <SelectItem key={"1"} value={"true"}>Individualni</SelectItem>
                <SelectItem key={"2"} value={"false"}>Grupni</SelectItem>
            </Select>
            <Select name="dayOfWeek" size="sm" label="Dan u nedelji" className="max-w-xs" onChange={handleSelectionChange}>
                <SelectItem key={"null"} value={"all"}>Svi</SelectItem>
                <SelectItem key={"MONDAY"} value={"MONDAY"}>Ponedeljak</SelectItem>
                <SelectItem key={"TUESDAY"} value={"TUESDAY"}>Utorak</SelectItem>
                <SelectItem key={"WEDNESDAY"} value={"WEDNESDAY"}>Sreda</SelectItem>
                <SelectItem key={"THURSDAY"} value={"THURSDAY"}>Četvrtak</SelectItem>
                <SelectItem key={"FRIDAY"} value={"FRIDAY"}>Petak</SelectItem>
                <SelectItem key={"SATURDAY"} value={"SATURDAY"}>Subota</SelectItem>
                <SelectItem key={"SUNDAY"} value={"SUNDAY"}>Nedelja</SelectItem>
            </Select>
            <button className="btn">Primeni</button>
        </form>
    )
}
export default Filter