import axios from "axios";
import { UserForm, UserInterface } from "@/interfaces/UserInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserLoggedInterface } from "@/interfaces/UserLoggedInterface";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

const endpoint = 'user';

const getUsers = async (): Promise<UserInterface[]> => {
    const response = await api.get(endpoint);
    return response.data as UserInterface[];
}

const addUser = async (newUser: UserForm): Promise<UserInterface> => {
    const response = await api.post(endpoint, newUser);
    return response.data as UserInterface;
}

const editUser = async (dataUser: UserInterface): Promise<UserInterface> => {
    const response = await api.put(`${endpoint}/${dataUser.id}`, dataUser);
    return response.data as UserInterface;
}

const removeUser = async (user: UserInterface): Promise<UserInterface> => {
    const response = await api.delete(`${endpoint}/${user.id}`);
    return response.data as UserInterface;
}

const login = async (email: string, password: string): Promise<UserLoggedInterface | null> => {
  const response = await api.get(`${endpoint}?email=${email}&password=${password}`);
  const users = response.data as UserInterface[];
  if (users[0]) {
    const expire = Date.now() + 8600000; // padrão: 24h
    const userLogged = { ...users[0], expire };
    await AsyncStorage.setItem("userLogged", JSON.stringify(userLogged));
    return userLogged;
  }
  return null;
};

const logout = async () => {
  await AsyncStorage.removeItem("userLogged");
};

export default {
    getUsers,
    addUser,
    editUser,
    removeUser,
    login,
    logout,
};