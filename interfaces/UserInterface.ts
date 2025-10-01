export interface UserInterface {
    id: number,
    name: string,
    email: string,
    password: string,
    enabled: boolean,
}

export type UserForm = Omit<UserInterface, "id">;