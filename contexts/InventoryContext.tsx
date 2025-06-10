import React, { createContext, useContext, useState } from "react";
import { ApiResponse } from "@/interfaces/ApiResponse";
import InventoryInterface from "@/interfaces/InventoryInterface";



interface InventoryContextType{
    inventorys:InventoryInterface[],
    addInventory: (inventory:InventoryInterface)=>ApiResponse,
    getInventoryBy: <T extends keyof InventoryInterface>(By:T,value:InventoryInterface[T])=>InventoryInterface[],
    updateInventory: (inventory:InventoryInterface)=>ApiResponse,
    removeInventoryById: (id:number)=>InventoryInterface | ApiResponse,
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export default function InventoryProvider(
    {children}:{children:React.ReactNode}){
     const [inventorys,setInventorys] = useState<InventoryInterface[]>([]);
    function addInventory(newInventory:InventoryInterface): ApiResponse{
        if(!newInventory.title ||
            !newInventory.description ||
            !newInventory.price_per_unity || 
            !newInventory.qty_product)
            return { message:"Preencha todos os campos obrigatórios",success:false } 
        newInventory.stock_value = newInventory.price_per_unity * newInventory.qty_product
        newInventory.id = inventorys.length+1
        setInventorys((oldInventorys)=>[...oldInventorys,newInventory])
        return { message:"Produto Criado!", success:false }
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
            return oldInventorys.filter((inventoryItem)=>inventoryItem.id!=id)
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