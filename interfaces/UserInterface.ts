import { RootInterface } from "./RootInterface";

export interface UserInterface extends RootInterface {
    name: string,
    email: string,
    password?: string,
    enabled: boolean,
    phone: string,
    cep: string,
}

export interface UserFilter {
    name: string,
    email: string,
    enabled?: boolean
}

export type UserForm = Omit<UserInterface, "id" | "password"> & { password: string };

export type UserPartial = Partial<UserInterface>;