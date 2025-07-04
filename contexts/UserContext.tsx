import { ApiResponse } from "@/interfaces/ApiResponse";
import { LoginInterface } from "@/interfaces/LoginInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import { Children, createContext, useContext, useState } from "react";

interface UserContextType {
    users: UserInterface[],
    userLogged: UserInterface | undefined;
    validationLogin: (inventory:LoginInterface)=>UserInterface | undefined,
    getUsersBy<T extends keyof UserInterface>(
        By: T,
        value: UserInterface[T]
    ): UserInterface[],
    isLoged: ()=>boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({children}:{children:React.ReactNode}) {
    const [users, setUsers] = useState<UserInterface[]>([
        {
            id: 1,
            name: "Emanuel Borges",
            email: "emanuel@gmail.com",
            password: "123"
        },
        {
            id: 2,
            name: "Lucas Rosa",
            email: "lucas@gmail.com",
            password: "1234@teste"
        }
    ])

    const [userLogged, setUserLogged] = useState<UserInterface | undefined>(undefined);

    function validationLogin(data: LoginInterface) {
        
        let vobjUser = undefined;

        users.map((user) => {
            if (user.email === data.email && user.password === data.password) {
                vobjUser = user; 
            }
        });

        setUserLogged(vobjUser);

        return vobjUser;
    }

    function getUsersBy<T extends keyof UserInterface>(
        By: T,
        value: UserInterface[T]
        ): UserInterface[] {
        return users.filter((user) => user[By] === value);
    }

    function isLoged(){
        return !!userLogged;
    }

    return (
        <UserContext.Provider value={{users,userLogged,validationLogin,getUsersBy, isLoged}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext);
    if(context===undefined) throw Error("Contexto de usuário não criado");
    return context;
}