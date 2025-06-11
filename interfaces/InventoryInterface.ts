import CategoryInterface from "./CategoryInterface";

export default interface InventoryInterface{
    id:number,
    title:string,
    stock_value:number,
    price_per_unity:number,
    qty_product:number,
    enabled:boolean,
    description:string;
    category:CategoryInterface | null;
}