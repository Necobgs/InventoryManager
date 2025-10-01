import axios from "axios";
import { SupplierForm, SupplierInterface } from "@/interfaces/SupplierInterface";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

const endpoint = 'supplier';

const getSuppliers = async (): Promise<SupplierInterface[]> => {
    const response = await api.get(endpoint);
    return response.data as SupplierInterface[];
}

const addSupplier = async (newSupplier: SupplierForm): Promise<SupplierInterface> => {
    const response = await api.post(endpoint, newSupplier);
    return response.data as SupplierInterface;
}

const editSupplier = async (dataSupplier: SupplierInterface): Promise<SupplierInterface> => {
    const response = await api.put(`${endpoint}/${dataSupplier.id}`, dataSupplier);
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