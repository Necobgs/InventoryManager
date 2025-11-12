import axios, { InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DashboardInterface } from "@/interfaces/DashboardInterface";

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

const endpoint = 'dashboard';

const getDashboard = async (): Promise<DashboardInterface> => {
    const response = await api.get(endpoint);
    console.log(response);
    return response.data as DashboardInterface;
}

export default {
    getDashboard
};