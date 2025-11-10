import axios, { InternalAxiosRequestConfig } from "axios";
import { UserFilter, UserForm, UserInterface } from "@/interfaces/UserInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const endpoint = 'user';

const getUsers = async (filters: UserFilter): Promise<UserInterface[]> => {
    const response = await api.get(`${endpoint}?filter={${filters.name ? `"name": { "$ilike": "%${filters.name}%" },` : ""} ${filters.email ? `"email": { "$ilike": "${filters.email}%" },` : ""} ${filters.enabled != undefined ? `"enabled": ${filters.enabled}` : ""}}`);
    console.log(response, filters)
    return response.data as UserInterface[];
}

const addUser = async (newUser: UserForm): Promise<UserInterface> => {
    const response = await api.post(endpoint, newUser);
    return response.data as UserInterface;
}

const editUser = async (dataUser: UserInterface): Promise<UserInterface> => {
    const response = await api.patch(`${endpoint}/${dataUser.id}`, dataUser);
    console.log(response)
    return response.data as UserInterface;
}

const removeUser = async (user: UserInterface): Promise<UserInterface> => {
    const response = await api.delete(`${endpoint}/${user.id}`);
    return response.data as UserInterface;
}

const validateToken = async(): Promise<{user: UserInterface, access_token: string}> => {

    const token = await AsyncStorage.getItem('token');
    let arrayToken = token?.split('.');

    if (token && arrayToken?.[1]) {
        const payload = JSON.parse(atob(arrayToken[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp < currentTime) {
            console.log("token expirado")
            throw new Error('Token expirado');
        }

        const response = await api.get(`${endpoint}/${payload.id}`);
        return { user: response.data, access_token: token };
    }
    
    throw new Error('Token não encontrado');
};

export default {
    getUsers,
    addUser,
    editUser,
    removeUser,
    validateToken,
};