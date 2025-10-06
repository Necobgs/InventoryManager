import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { SupplierInterface } from "@/interfaces/SupplierInterface";

export type InventoryFormType = {
  title: string;
  description: string;
  qty_product: number;
  price_per_unity: number;
  category: CategoryInterface | null;
  supplier: SupplierInterface | null;
};
