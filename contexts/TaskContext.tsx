import React, { createContext, useContext, useState } from "react";
import { TaskStatusConst } from "@/constants/Status";
import { useTaskStatus } from "./TaskStatusContext";
import { ApiResponse } from "@/interfaces/ApiResponse";
import TaskInterface from "@/interfaces/TaskInterface";



interface TaskContextType{
    tasks:TaskInterface[],
    addTask: (task:TaskInterface)=>ApiResponse,
    getTaskById: (id:number)=>TaskInterface | null
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export default function TaskProvider(
    {children}:{children:React.ReactNode}){
    const taskStatus = useTaskStatus()
    const [tasks,setTasks] = useState<TaskInterface[]>([
        {
            id:1,
            status: taskStatus.getStatusById(1)!,
            image:require("@/assets/images/icon.png"),
            title:"Titulo da tarefa 1",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:2,
            status: taskStatus.getStatusById(2)!,
            image:require("@/assets/images/icon.png"),
            title:"Titulo da tarefa 2",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:3,
            status: taskStatus.getStatusById(3)!,
            image:require("@/assets/images/icon.png"),
            title:"Titulo da tarefa 3",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        }

    ]);
    
    function addTask(task:TaskInterface): ApiResponse{
        if(!task.description || !task.image || !task.status || !task.title) return { message:"Preencha todos os campos obrigatórios",sucess:false } 
        setTasks((oldTasks)=>[...oldTasks,task])
        return { message:"Tarefa criada!", sucess:false }
    }

    function getTaskById(id:number){
        return tasks.find((task)=>task.id==id) || null    
    }

    return (
        <TaskContext.Provider value={{tasks,addTask,getTaskById}}>
            {children}
        </TaskContext.Provider>
    )
}

export function useTask(){
    const context = useContext(TaskContext);
    if(context===undefined) throw Error("Contexto de tasks não criado");
    return context;
}