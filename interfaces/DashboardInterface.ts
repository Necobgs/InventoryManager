import { CategoryInterface } from "./CategoryInterface";
import InventoryInterface from "./InventoryInterface";
import { MovementInterface } from "./MovementInterface";
import { SupplierInterface } from "./SupplierInterface";

export interface DashboardInterface {
    category: CategoryInterface[],
    supplier: SupplierInterface[],
    inventory: InventoryInterface[],
    movement: MovementInterface[],
}