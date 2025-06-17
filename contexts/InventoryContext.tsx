import React, { createContext, useContext, useState } from "react";
import { ApiResponse } from "@/interfaces/ApiResponse";
import InventoryInterface from "@/interfaces/InventoryInterface";
import { InventoryFormType } from "@/types/InventoryFormType";



interface InventoryContextType{
    inventorys:InventoryInterface[],
    addInventory: (inventory:InventoryFormType)=>ApiResponse,
    getInventoryBy: <T extends keyof InventoryInterface>(By:T,value:InventoryInterface[T])=>InventoryInterface[],
    updateInventory: (inventory:InventoryInterface)=>ApiResponse,
    removeInventoryById: (id:number)=> ApiResponse,
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export default function InventoryProvider(
    {children}:{children:React.ReactNode}){
     const [inventorys,setInventorys] = useState<InventoryInterface[]>([]);
    function addInventory(newInventory:InventoryFormType): ApiResponse{
        if(!newInventory.title ||
            !newInventory.description ||
            !newInventory.price_per_unity || 
            !newInventory.qty_product)
            return { message:"Preencha todos os campos obrigatórios",success:false } 
         
        setInventorys((oldInventorys)=>[...oldInventorys,{
            ...newInventory,
            id: oldInventorys.length+1,
            stock_value: newInventory.price_per_unity * newInventory.qty_product,
            enabled:true
        } as InventoryInterface])
        return { message:"Produto Criado!", success:true }
    }

    function updateInventory(newInventory: InventoryInterface): ApiResponse {
    if (!newInventory.price_per_unity || !newInventory.qty_product) {
        return { message: "Preencha todos os campos obrigatórios", success: false };
    }
    const oldInventory = getInventoryBy('id',newInventory.id);
    if (!oldInventory) {
        return { message: "Tarefa inexistente", success: false };
    }
    newInventory.stock_value = newInventory.price_per_unity * newInventory.qty_product
    setInventorys((oldInventorys) =>
        oldInventorys.map((inventory) =>
        inventory.id === newInventory.id ? newInventory : inventory
        )
    );
    return { message: "Tarefa Atualizada!", success: true };
    }

    function getInventoryBy<T extends keyof InventoryInterface>(By:T,value:InventoryInterface[T]){
        return inventorys.filter((inventory)=>inventory[By]==value)    
    }

    function removeInventoryById(id:number){
        const inventory = getInventoryBy('id',id);
        if(!inventory) return {message:"Produto não encontrado",success:false}   
        setInventorys((oldInventorys)=>{
            oldInventorys.map((inventoryItem)=>{
                if (inventoryItem.id==id){
                    inventoryItem.enabled=false
                }
                
                })
                return oldInventorys
        }) 
        return {message:"Sucesso ao remover o produto",success:true}
    }

    return (
        <InventoryContext.Provider value={{inventorys,addInventory,getInventoryBy,updateInventory,removeInventoryById}}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory(){
    const context = useContext(InventoryContext);
    if(context===undefined) throw Error("Contexto de inventorys não criado");
    return context;
}