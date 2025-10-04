import axios from "axios";
import { MovementForm, MovementInterface } from "@/interfaces/MovementInterface";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

const endpoint = 'movement';

const getMovements = async (): Promise<MovementInterface[]> => {
    const response = await api.get(endpoint);
    return response.data as MovementInterface[];
}

const addMovement = async (newMovement: MovementForm): Promise<MovementInterface> => {
    const response = await api.post(endpoint, newMovement);
    return response.data as MovementInterface;
}

const editMovement = async (dataMovement: MovementInterface): Promise<MovementInterface> => {
    const response = await api.put(`${endpoint}/${dataMovement.id}`, dataMovement);
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