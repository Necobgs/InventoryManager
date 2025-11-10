import { RootInterface } from "./RootInterface";

export interface UserLoggedInterface extends RootInterface{
    name: string,
    email?: string,
    password?: string,
    enabled?: boolean,
    expire?: number,
}