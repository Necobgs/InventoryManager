import { RootInterface } from "./RootInterface";

export interface CategoryInterface extends RootInterface{
    title:string,
    description:string,
    color:string,
    enabled:boolean
}

export interface CategoryFilter {
    title: string,
    description: string,
    enabled?: boolean
}

export type CategoryForm = Omit<CategoryInterface, "id">;

export type CategoryPartial = Partial<CategoryInterface>;