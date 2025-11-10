import axios, { InternalAxiosRequestConfig } from "axios";
import { SupplierFilter, SupplierForm, SupplierInterface } from "@/interfaces/SupplierInterface";
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

const endpoint = 'supplier';

const getSuppliers = async (filters: SupplierFilter): Promise<SupplierInterface[]> => {
    const response = await api.get(`${endpoint}?filter={${filters.name ? `"name": { "$ilike": "%${filters.name}%" },` : ""} ${filters.cnpj ? `"cnpj": { "$ilike": "${filters.cnpj}%" },` : ""} ${filters.enabled != undefined ? `"enabled": ${filters.enabled}` : ""}}`);
    console.log(response, filters)
    return response.data as SupplierInterface[];
}

const addSupplier = async (newSupplier: SupplierForm): Promise<SupplierInterface> => {
    const response = await api.post(endpoint, newSupplier);
    return response.data as SupplierInterface;
}

const editSupplier = async (dataSupplier: SupplierInterface): Promise<SupplierInterface> => {
    const response = await api.patch(`${endpoint}/${dataSupplier.id}`, dataSupplier);
    return response.data as SupplierInterface;
}

const removeSupplier = async (supplier: SupplierInterface): Promise<SupplierInterface> => {
    const response = await api.delete(`${endpoint}/${supplier.id}`);
    return response.data as SupplierInterface;
}

export default {
    getSuppliers,
    addSupplier,
    editSupplier,
    removeSupplier,
};