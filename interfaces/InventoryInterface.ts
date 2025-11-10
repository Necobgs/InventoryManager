import { CategoryInterface } from "./CategoryInterface";
import { RootInterface } from "./RootInterface";
import { SupplierInterface } from "./SupplierInterface";

export default interface InventoryInterface extends RootInterface{
    title:string,
    stock_value:number,
    price_per_unity:number,
    qty_product:number,
    enabled:boolean,
    description:string;
    category:CategoryInterface | null,
    supplier:SupplierInterface | null,
}

export interface InventoryFilter {
    title: string,
    description: string,
    enabled?: boolean
}

export type InventoryForm = Omit<InventoryInterface, "id">;

export type InventoryPartial = Partial<InventoryInterface>;

export type InventoryPartialMovementFilter = Partial<InventoryInterface> & { id: number; title: string };