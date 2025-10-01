import axios from "axios";
import InventoryInterface, { InventoryForm } from "@/interfaces/InventoryInterface";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

const endpoint = 'inventory';

const getInventorys = async (): Promise<InventoryInterface[]> => {
    const response = await api.get(endpoint);
    return response.data as InventoryInterface[];
}

const addInventory = async (newInventory: InventoryForm): Promise<InventoryInterface> => {
    const response = await api.post(endpoint, newInventory);
    return response.data as InventoryInterface;
}

const editInventory = async (dataInventory: InventoryInterface): Promise<InventoryInterface> => {
    const response = await api.put(`${endpoint}/${dataInventory.id}`, dataInventory);
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