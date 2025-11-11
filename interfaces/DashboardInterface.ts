import { CategoryInterface } from "./CategoryInterface";
import InventoryInterface from "./InventoryInterface";
import { SupplierInterface } from "./SupplierInterface";

export interface DashboardInterface {
    inventorys: InventoryInterface[],
    categorys: CategoryInterface[],
    suppliers: SupplierInterface[]
}