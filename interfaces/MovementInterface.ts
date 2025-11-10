import { InventoryPartial, InventoryPartialMovementFilter } from "./InventoryInterface";
import { RootInterface } from "./RootInterface";
import { UserLoggedInterface } from "./UserLoggedInterface";

export interface MovementInterface extends RootInterface {
    inventory: InventoryPartial | null,
    user: UserLoggedInterface | null,
    quantity: number,
    movement_value: number,
    price_at_time: number,
}

export interface MovementFilter {
    inventory: InventoryPartialMovementFilter | null,
    operation?: number
}

export type MovementForm =  Omit<MovementInterface, 'id'>;

export type MovementPartial = Partial<MovementInterface>;