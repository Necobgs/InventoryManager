import TaskStatusInterface from "./TaskStatusInterface"

export default interface TaskInterface{
    id:number,
    title:string,
    description:string,
    status:TaskStatusInterface,
    image:any
}