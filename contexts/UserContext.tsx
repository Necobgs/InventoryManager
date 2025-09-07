import { ApiResponse } from "@/interfaces/ApiResponse";
import { LoginInterface } from "@/interfaces/LoginInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import { UserLoggedInterface } from "@/interfaces/UserLoggedInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    users: UserInterface[],
    userLogged: UserInterface | undefined;
    usersLoaded: boolean,
    addUser: (data:UserInterface)=> ApiResponse,
    updateUser: (data:UserInterface)=> ApiResponse,
    disableOrEnable: (id:number)=> ApiResponse,
    validationLogin: (inventory:LoginInterface,expire:number)=>UserInterface | undefined,
    getUsersBy<T extends keyof UserInterface>(
        By: T,
        value: UserInterface[T]
    ): UserInterface[],
    getUserLoggedStorage(): Promise<UserLoggedInterface | undefined>,
    isLoged: ()=>boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({children}:{children:React.ReactNode}) {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [userLogged, setUserLogged] = useState<UserLoggedInterface | undefined>(undefined);
    const [usersLoaded, setUsersLoaded] = useState<boolean>(false);

    const defaultUsers = [
        {
            id: 1,
            name: "Emanuel Borges",
            email: "emanuel@gmail.com",
            password: "123",
            enabled: true,
        },
        {
            id: 2,
            name: "Lucas Rosa",
            email: "lucas@gmail.com",
            password: "1234@teste",
            enabled: true,
        }
    ];

    useEffect(() => {
        async function loadData() {
            const newSuppliers = await getUsersStorage();
            if (newSuppliers[0]) {
                setUsers(newSuppliers);
            }
            else {
                setUsers(defaultUsers);
            }
            setUsersLoaded(true);
        }
        loadData();
    },[]);
    
    function addUser(data: UserInterface): ApiResponse {
        
        setUsers((oldUsers) => {
            const newId = !oldUsers[0] ? 1 : oldUsers.reduce((max, current) => current.id > max.id ? current : max).id + 1;

            const newUsers = [
                ...oldUsers,
                {
                    ...data,
                    id: newId,
                }
            ];

            setUsersStorage(newUsers);
            return newUsers;
        })

        return { message: "Usuário cadastrado com sucesso!", success: true };
    }
    
    function updateUser(data: UserInterface): ApiResponse {

        setUsers((oldUsers) => {
            const newUsers = oldUsers.map((vobj) => {
                return vobj.id === data.id ? {...vobj, ...data} : vobj;
            });

            setUsersStorage(newUsers);
            return newUsers;
        });

        return { message: "Usuário alterado com sucesso!", success: true };
    }


    function disableOrEnable(id: number): ApiResponse {

        const user = getUsersBy("id", id);

        if (user.length === 0) {
         return { message: "Usuário não encontrado", success: false };
        }

        setUsers((oldUsers) => {
            const newUsers = oldUsers.map((vobj) => {
                return vobj.id === id ? {...vobj, enabled: !vobj.enabled } : vobj;
            });

            setUsersStorage(newUsers);
            return newUsers;
        });

        return { message: "Sucesso", success: true };
    }

    function validationLogin(data: LoginInterface, expire: number) {
        
        if (expire && expire < Date.now()) return;

        let vobjUserLogged: UserLoggedInterface | undefined = undefined;

        if (!expire) {
            expire = Date.now() + 86400000;
        }
        
        users.map((user) => {
            if (user.email === data.email && user.password === data.password && user.enabled) {
                vobjUserLogged = {...user, expire: expire};
            }
        });

        setUserLogged(vobjUserLogged);
        setUserLoggedStorage(vobjUserLogged);

        return vobjUserLogged;
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

    async function setUsersStorage(newUsers: UserInterface[]) {
        await AsyncStorage.setItem("users", JSON.stringify(newUsers));
    }

    async function getUsersStorage(): Promise<UserInterface[]> {
        const data_json = await AsyncStorage.getItem("users");
        const data: UserInterface[] = data_json ? JSON.parse(data_json) : [];
        return data;
    }

    async function setUserLoggedStorage(user: UserLoggedInterface | undefined) {
        await AsyncStorage.setItem("userlogged", user ? JSON.stringify(user) : "");
    }

    async function getUserLoggedStorage(): Promise<UserLoggedInterface | undefined> {
        const data_json = await AsyncStorage.getItem("userlogged");
        const data: UserLoggedInterface | undefined = data_json ? JSON.parse(data_json) : undefined;
        return data;
    }

    return (
        <UserContext.Provider value={{users, userLogged, usersLoaded, addUser, updateUser, disableOrEnable, validationLogin, getUsersBy, getUserLoggedStorage, isLoged}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext);
    if(context===undefined) throw Error("Contexto de usuário não criado");
    return context;
}