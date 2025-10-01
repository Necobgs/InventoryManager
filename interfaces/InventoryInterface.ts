import { CategoryInterface } from "./CategoryInterface";
import { SupplierInterface } from "./SupplierInterface";

export default interface InventoryInterface{
    id:number,
    title:string,
    stock_value:number,
    price_per_unity:number,
    qty_product:number,
    enabled:boolean,
    description:string;
    category:CategoryInterface | null;
    supplier:SupplierInterface | null;
}

export type InventoryForm = Omit<InventoryInterface, "id">;