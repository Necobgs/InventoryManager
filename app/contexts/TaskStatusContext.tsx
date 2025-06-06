import React, { createContext, useContext, useState } from "react";
import Status from "../interfaces/status";

interface TaskStatusContextType{
    taskStatus : Status[],
    getStatusById: (id:number)=> null | Status
}

const TaskStatusContext = createContext<TaskStatusContextType | undefined>(undefined)

export function TaskStatusProvider(
    {children}:{children:React.ReactNode}){

    const [taskStatus,setTaskStatus] = useState<Status[]>([
        {id:1,description:"finished"},
        {id:2,description:"in process"},
        {id:3,description:"new task"}
    ])

    function getStatusById(id:number){
        return taskStatus.find((status)=>status.id==id) || null;
    }

    return (
    <TaskStatusContext.Provider value={{taskStatus, getStatusById}}>
        {children}
    </TaskStatusContext.Provider>)
}

export function useTaskStatus(){
    const context = useContext(TaskStatusContext);
    if(context===undefined) throw new Error("Contexto de status das tarefas não definido");
    return context;
}