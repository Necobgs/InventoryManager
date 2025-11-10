import axios, { InternalAxiosRequestConfig } from "axios";
import InventoryInterface, { InventoryFilter, InventoryForm } from "@/interfaces/InventoryInterface";
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

const endpoint = 'inventory';

const getInventorys = async (filters: InventoryFilter): Promise<InventoryInterface[]> => {
    const response = await api.get(`${endpoint}?filter={${filters.title ? `"title": { "$ilike": "%${filters.title}%" },` : ""} ${filters.description ? `"description": { "$ilike": "%${filters.description}%" },` : ""} ${filters.enabled != undefined ? `"enabled": ${filters.enabled}` : ""}}`);
    console.log(response, filters);
    return response.data as InventoryInterface[];
}

const addInventory = async (newInventory: InventoryForm): Promise<InventoryInterface> => {
  const { category, supplier, ...rest } = newInventory;
  
  const payload = {
    ...rest,
    category_id: category?.id,
    supplier_id: supplier?.id,
  };

  const response = await api.post(endpoint, payload);
  return response.data as InventoryInterface;
}

const editInventory = async (dataInventory: InventoryInterface): Promise<InventoryInterface> => {

  const { category, supplier, ...rest } = dataInventory;
  
  const payload = {
    ...rest,
    category_id: category?.id,
    supplier_id: supplier?.id,
  };

  const response = await api.patch(`${endpoint}/${dataInventory.id}`, payload);
  return response.data as InventoryInterface;
}

const removeInventory = async (inventory: InventoryInterface): Promise<InventoryInterface> => {
  const response = await api.delete(`${endpoint}/${inventory.id}`);
  return response.data as InventoryInterface;
}

export default {
    getInventorys,
    addInventory,
    editInventory,
    removeInventory,
};