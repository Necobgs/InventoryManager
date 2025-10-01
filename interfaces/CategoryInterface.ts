export interface CategoryInterface{
    id:number,
    description:string,
    enabled:boolean
}

export type CategoryForm = Omit<CategoryInterface, "id">;