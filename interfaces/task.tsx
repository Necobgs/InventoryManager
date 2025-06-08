import Status from "./status";

export default interface Task{
    id:number,
    title:string,
    description:string,
    status:Status,
    image:any
}