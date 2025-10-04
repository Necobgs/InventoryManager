import InventoryInterface from "./InventoryInterface";
import { UserInterface } from "./UserInterface";

export interface MovementInterface {
    id: number,
    inventory: InventoryInterface | null,
    user: UserInterface | null,
    quantity: number,
    value: number,
    price_at_time: number,
    date: Date,
}

export type MovementForm =  Omit<MovementInterface, 'id'>;