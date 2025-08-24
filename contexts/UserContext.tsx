import { ApiResponse } from "@/interfaces/ApiResponse";
import { LoginInterface } from "@/interfaces/LoginInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import { createContext, useContext, useState } from "react";

interface UserContextType {
    users: UserInterface[],
    userLogged: UserInterface | undefined;
    addUser: (data:UserInterface)=> ApiResponse,
    updateUser: (data:UserInterface)=> ApiResponse,
    removeUserById: (id:number)=> ApiResponse,
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
    
     function addUser(data: UserInterface): ApiResponse {
    
        const newId = !users[0] ? 1 : users.reduce((max, current) => current.id > max.id ? current : max).id + 1;
        
        setUsers((oldUsers) => {
            return [
                ...oldUsers,
                {
                    ...data,
                    id: newId,
                }
            ];
        })

        return { message: "Usuário cadastrado com sucesso!", success: true };
    }
    
    function updateUser(data: UserInterface): ApiResponse {

        const newUsers: UserInterface[] = users.map((vobj) => {
            return vobj.id === data.id ? {...vobj, ...data} : vobj;
        })

        setUsers(newUsers);

        return { message: "Usuário alterado com sucesso!", success: true };
    }

    function removeUserById(id: number): ApiResponse {

        const newUsers: UserInterface[] = users.filter(vobj => vobj.id !== id);
        
        setUsers(newUsers);

        return { message: "Usuário removido com sucesso!", success: true };
    }

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
        <UserContext.Provider value={{users, userLogged, addUser, updateUser, removeUserById, validationLogin, getUsersBy, isLoged}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext);
    if(context===undefined) throw Error("Contexto de usuário não criado");
    return context;
}