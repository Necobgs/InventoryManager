import { ApiResponse } from "@/interfaces/ApiResponse";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CategoryContextType{
    categories:CategoryInterface[],
    findCategoryBy:<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]) => CategoryInterface[],
    filterCategory: (enabled: boolean, description: string) => CategoryInterface[],
    addCategory: (category:CategoryInterface) => ApiResponse,
    disableOrEnable: (id:number) => ApiResponse,
    updateCategory: (data:CategoryInterface) => ApiResponse
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider(
    {children}: {children:React.ReactNode}
){
    const [categories,setCategories] = useState<CategoryInterface[]>([]);

    useEffect(() => {
        async function loadData() {
          const newCategory = await getCategoriesStorage();
          setCategories(newCategory);
        }
        loadData();
    },[]);

    function isValidCategory(category:CategoryInterface){
        return category.description
    }

    function findCategoryBy<T extends keyof CategoryInterface>(by:T,value:CategoryInterface[T]){
        return categories.filter((category)=>category[by]==value)
    }

    function filterCategory(enabled: boolean, description: string){
        return categories.filter((category)=> category["enabled"] == enabled && category["description"].toLocaleLowerCase().includes(description.trim().toLocaleLowerCase()));
    }

    function addCategory(newCategory:CategoryInterface): ApiResponse{
        if(!isValidCategory(newCategory)) return { message:"Preencha todos os campos", success:false }
        
        setCategories((oldCategories)=>{

            const newId = !oldCategories[0] ? 1 : oldCategories.reduce((max, current) => current.id > max.id ? current : max).id + 1;

            const newCategories = [   
                ...oldCategories,{
                ...newCategory,
                id:newId}
            ]

            setCategoriesStorage(newCategories);
            return newCategories;
        });

        return {message:"Sucesso ao cadastrar categoria",success:true};
    }

    function disableOrEnable(id:number): ApiResponse{
        const categoryFounded = findCategoryBy('id',id);
        if(!categoryFounded) return { message:"Categoria não encontrada",success:false }
        setCategories((oldCategories) => {
            const newCategories = oldCategories.map((category)=>category.id != id ? category : {...category,enabled:!category.enabled});
            setCategoriesStorage(newCategories);
            return newCategories;
        })
        return { message:"Sucesso",success:true }
    }

    function updateCategory(data:CategoryInterface){
        const category = findCategoryBy('id',data.id)[0]
        if(!category) return {message:"Não foi possível encontrar a categoria",success:false}
        setCategories((oldCategories) => {
            const newCategories = oldCategories.map((category)=>category.id == data.id ? data : category);
            setCategoriesStorage(newCategories);
            return newCategories;
        })
        return {message:"Sucesso ao atualizar a categoria!",success:true}
    }

    async function setCategoriesStorage(newCategories: CategoryInterface[]) {
        await AsyncStorage.setItem("categories", JSON.stringify(newCategories));
    }

    async function getCategoriesStorage(): Promise<CategoryInterface[]> {
        const data_json = await AsyncStorage.getItem("categories");
        const data: CategoryInterface[] = data_json ? JSON.parse(data_json) : [];
        return data;
    }

    return (
    <CategoryContext.Provider value={{addCategory,disableOrEnable,findCategoryBy,filterCategory,categories,updateCategory}}>
        {children}
    </CategoryContext.Provider>
    )
}

export default function useCategory(){
    const context = useContext(CategoryContext)
    if(!context) throw Error("Contexto de category não encontrado")
    return context;
}
