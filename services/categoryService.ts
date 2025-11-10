import axios, { InternalAxiosRequestConfig } from "axios";
import { CategoryFilter, CategoryForm, CategoryInterface } from "@/interfaces/CategoryInterface";
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

const endpoint = 'category';

const getCategories = async (filters: CategoryFilter): Promise<CategoryInterface[]> => {
    const response = await api.get(`${endpoint}?filter={${filters.title ? `"title": { "$ilike": "%${filters.title}%" },` : ""} ${filters.description ? `"description": { "$ilike": "%${filters.description}%" },` : ""} ${filters.enabled != undefined ? `"enabled": ${filters.enabled}` : ""}}`);
    console.log(response, filters);
    return response.data as CategoryInterface[];
}

const addCategory = async (newCategory: CategoryForm): Promise<CategoryInterface> => {
    const response = await api.post(endpoint, newCategory);
    return response.data as CategoryInterface;
}

const editCategory = async (dataCategory: CategoryInterface): Promise<CategoryInterface> => {
    const response = await api.patch(`${endpoint}/${dataCategory.id}`, dataCategory);
    return response.data as CategoryInterface;
}

const removeCategory = async (category: CategoryInterface): Promise<CategoryInterface> => {
    const response = await api.delete(`${endpoint}/${category.id}`);
    return response.data as CategoryInterface;
}

export default {
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
};