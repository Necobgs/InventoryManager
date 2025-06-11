import CategoryInterface from "@/interfaces/CategoryInterface";

export type InventoryFormType = {
  title: string;
  description: string;
  qty_product: number;
  price_per_unity: number;
  category:CategoryInterface | null;
};
