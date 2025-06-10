import { ApiResponse } from "@/interfaces/ApiResponse";
import CategoryInterface from "@/interfaces/CategoryInterface";
import React, { createContext, useContext, useState } from "react";

interface CategoryContextType{
    categories:CategoryInterface[],
    findCategoryBy:<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]) => CategoryInterface[] | ApiResponse,
    addCategory: (category:CategoryInterface) => ApiResponse,
    removeCategory: (id:number) => ApiResponse
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);


export function CategoryProvider(
    {children}: {children:React.ReactNode}
){
    const [categories,setCategories] = useState<CategoryInterface[]>([
        {
            id:1,
            description:"Fruta"
        },
        {
            id:2,
            description:"Bebida"
        },
        {
            id:3,
            description:"Energético"
        }
    ])

    function isValidCategory(category:CategoryInterface){
        return category.description
    }

    function findCategoryBy<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]){
        return categories.filter((category)=>category[by]==value)
    }

    function addCategory(newCategory:CategoryInterface): ApiResponse{
        if(!isValidCategory(newCategory)) return { message:"Preencha todos os campos", success:false }
        setCategories((oldCategories)=>[...oldCategories,newCategory])
        return {message:"Sucesso ao cadastrar categoria",success:true}
    }

    function removeCategory(id:number): ApiResponse{
        const categoryFounded = findCategoryBy('id',id);
        if(!categoryFounded) return { message:"Categoria não encontrada",success:false }
        setCategories((oldCategories)=>
            oldCategories.filter((category)=>category.id != id)
        )
        return { message:"Categoria excluida com sucesso",success:true }
    }

    return (
    <CategoryContext.Provider value={{addCategory,removeCategory,findCategoryBy,categories}}>
        {children}
    </CategoryContext.Provider>
    )
}

export default function useCategory(){
    const context = useContext(CategoryContext)
    if(!context) throw Error("Contexto de category não encontrado")
    return context;
}
