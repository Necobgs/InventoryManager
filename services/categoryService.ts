import axios from "axios";
import { CategoryForm, CategoryInterface } from "@/interfaces/CategoryInterface";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

const endpoint = 'category';

const getCategories = async (): Promise<CategoryInterface[]> => {
    const response = await api.get(endpoint);
    return response.data as CategoryInterface[];
}

const addCategory = async (newCategory: CategoryForm): Promise<CategoryInterface> => {
    const response = await api.post(endpoint, newCategory);
    return response.data as CategoryInterface;
}

const editCategory = async (dataCategory: CategoryInterface): Promise<CategoryInterface> => {
    const response = await api.put(`${endpoint}/${dataCategory.id}`, dataCategory);
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