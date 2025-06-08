import React, { createContext, useContext, useState } from "react";
import TaskStatusInterface from "@/interfaces/TaskStatusInterface";
import { TaskStatusConst } from "@/constants/Status";


interface TaskStatusContextType{
    taskStatus : TaskStatusInterface[],
    getStatusById: (id:number)=> null | TaskStatusInterface,
    getStatusByDescription: (description:string)=> null | TaskStatusInterface,
}

const TaskStatusContext = createContext<TaskStatusContextType | undefined>(undefined)

export function TaskStatusProvider(
    {children}:{children:React.ReactNode}){

    const [taskStatus,setTaskStatus] = useState<TaskStatusInterface[]>([
        {id:1,description:TaskStatusConst.finished},
        {id:2,description:TaskStatusConst.in_processing},
        {id:3,description:TaskStatusConst.new_task}
    ])

    function getStatusById(id:number){
        return taskStatus.find((status)=>status.id==id) || null;
    }

    function getStatusByDescription(description:string){
        return taskStatus.find((status)=>status.description==description) || null;
    }

    return (
    <TaskStatusContext.Provider value={{taskStatus, getStatusById,getStatusByDescription}}>
        {children}
    </TaskStatusContext.Provider>)
}

export function useTaskStatus(){
    const context = useContext(TaskStatusContext);
    if(context===undefined) throw new Error("Contexto de status das tarefas não definido");
    return context;
}