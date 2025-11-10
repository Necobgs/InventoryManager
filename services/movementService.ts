import axios, { InternalAxiosRequestConfig } from "axios";
import { MovementFilter, MovementForm, MovementInterface } from "@/interfaces/MovementInterface";
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

const endpoint = 'movement';

const getMovements = async (filters: MovementFilter): Promise<MovementInterface[]> => {
    const response = await api.get(`${endpoint}?filter={${filters.inventory?.id ? `"inventory.id":{"$eq":${filters.inventory.id}}` : ""}}`);
    console.log(response, filters)
    return response.data as MovementInterface[];
}

const addMovement = async (newMovement: MovementForm): Promise<MovementInterface> => {

  const { inventory, user, ...rest } = newMovement;
  
  const payload = {
    ...rest,
    inventory_id: inventory?.id,
    user_id: user?.id,
  };

  const response = await api.post(endpoint, payload);
  return response.data as MovementInterface;
}

const editMovement = async (dataMovement: MovementInterface): Promise<MovementInterface> => {

  const { inventory, user, ...rest } = dataMovement;
  
  const payload = {
    ...rest,
    inventory_id: inventory?.id,
    user_id: user?.id,
  };

  const response = await api.patch(`${endpoint}/${dataMovement.id}`, payload);
  return response.data as MovementInterface;
}

const removeMovement = async (movement: MovementInterface): Promise<MovementInterface> => {
  const response = await api.delete(`${endpoint}/${movement.id}`);
  return response.data as MovementInterface;
}

export default {
    getMovements,
    addMovement,
    editMovement,
    removeMovement,
};