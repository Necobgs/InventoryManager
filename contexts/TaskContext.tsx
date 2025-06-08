import React, { createContext, useContext, useState } from "react";
import Task from "../interfaces/task";
import { useTaskStatus } from "./TaskStatusContext";
import { ApiResponse } from "../interfaces/api-response";

interface TaskContextType{
    tasks:Task[],
    addTask: (task:Task)=>ApiResponse,
    getTaskById: (id:number)=>Task | null
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export default function TaskProvider(
    {children}:{children:React.ReactNode}){
    const taskStatus = useTaskStatus()
    const [tasks,setTasks] = useState<Task[]>([
        {
            id:1,
            status: taskStatus.taskStatus[0],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 1",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:2,
            status: taskStatus.taskStatus[1],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 2",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:3,
            status: taskStatus.taskStatus[2],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 3",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:4,
            status: taskStatus.taskStatus[2],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 3",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:5,
            status: taskStatus.taskStatus[2],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 3",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        },
        {
            id:6,
            status: taskStatus.taskStatus[2],
            image:require("../assets/images/icon.png"),
            title:"Titulo da tarefa 3",
            description:"Descrição meramente longa devido aos testes a serem para a validação dos sucesso da ocultação dos demais caracteres que ultrapassarem o limite pré imposto de 3 linha :3"
        }

    ]);
    
    function addTask(task:Task): ApiResponse{
        if(!task.description || !task.image || !task.status || !task.title) return { message:"Preencha todos os campos obrigatórios",sucess:false } 
        setTasks((oldTasks)=>[...oldTasks,task])
        return { message:"Tarefa criada!", sucess:false }
    }

    function getTaskById(id:number){
        return tasks.find((task)=>task.id==id) || null    
    }

    function updateTaskS(taskUpdated:Task){
        if(!tasks.filter((task)=>task.id==taskUpdated.id)[0]) return false
        setTasks((oldValue:Task[])=> [...oldValue,taskUpdated])
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