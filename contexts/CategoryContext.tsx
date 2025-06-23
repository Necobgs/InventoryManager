import { ApiResponse } from "@/interfaces/ApiResponse";
import CategoryInterface from "@/interfaces/CategoryInterface";
import React, { createContext, useContext, useState } from "react";

interface CategoryContextType{
    categories:CategoryInterface[],
    findCategoryBy:<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]) => CategoryInterface[],
    addCategory: (category:CategoryInterface) => ApiResponse,
    disableOrEnable: (id:number) => ApiResponse,
    updateCategory: (data:CategoryInterface) => ApiResponse
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);


export function CategoryProvider(
    {children}: {children:React.ReactNode}
){
    const [categories,setCategories] = useState<CategoryInterface[]>([
        {
            id:1,
            description:"Fruta",
            enabled:true
        },
        {
            id:2,
            description:"Bebida",
            enabled:true
        },
        {
            id:3,
            description:"Energético",
            enabled:true
        },
    ])

    function isValidCategory(category:CategoryInterface){
        return category.description
    }

    function findCategoryBy<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]){
        return categories.filter((category)=>category[by]==value)
    }

    function addCategory(newCategory:CategoryInterface): ApiResponse{
        if(!isValidCategory(newCategory)) return { message:"Preencha todos os campos", success:false }
        setCategories((oldCategories)=>[...oldCategories,{
            ...newCategory,
            id:categories.length+1
        }]);

        return {message:"Sucesso ao cadastrar categoria",success:true};
    }

    function disableOrEnable(id:number): ApiResponse{
        const categoryFounded = findCategoryBy('id',id);
        if(!categoryFounded) return { message:"Categoria não encontrada",success:false }
        setCategories((oldCategories)=>
            oldCategories.map((category)=>category.id != id ? category : {...category,enabled:!category.enabled})
        )
        return { message:"Sucesso",success:true }
    }

    function updateCategory(data:CategoryInterface){
        const category = findCategoryBy('id',data.id)[0]
        if(!category) return {message:"Não foi possível encontrar a categoria",success:false}
        setCategories((oldCategories)=>
            oldCategories.map((category)=>category.id == data.id ? data : category)
        )
        return {message:"Sucesso ao atualizar a categoria!",success:true}
    }

    return (
    <CategoryContext.Provider value={{addCategory,disableOrEnable,findCategoryBy,categories,updateCategory}}>
        {children}
    </CategoryContext.Provider>
    )
}

export default function useCategory(){
    const context = useContext(CategoryContext)
    if(!context) throw Error("Contexto de category não encontrado")
    return context;
}
