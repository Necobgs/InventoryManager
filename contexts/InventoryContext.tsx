import React, { createContext, useContext, useState } from "react";
import { ApiResponse } from "@/interfaces/ApiResponse";
import InventoryInterface from "@/interfaces/InventoryInterface";



interface InventoryContextType{
    inventorys:InventoryInterface[],
    addInventory: (inventory:InventoryInterface)=>ApiResponse,
    getInventoryById: (id:number)=>InventoryInterface | null,
    updateInventory: (inventory:InventoryInterface)=>ApiResponse,
    removeInventoryById: (id:number)=>InventoryInterface | ApiResponse,
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export default function InventoryProvider(
    {children}:{children:React.ReactNode}){
    const [inventorys,setInventorys] = useState<InventoryInterface[]>([
        {
            id:1,
            title:"Nescau",
            price_per_unity:5,
            qty_product:2,
            stock_value:10,
            enabled:true
        },
        {
            id:2,
            title:"Banana",
            price_per_unity:2,
            qty_product:4,
            stock_value:8,
            enabled:true
        },
        {
            id:3,
            title:"Monster",
            price_per_unity:10,
            qty_product:3,
            stock_value:30,
            enabled:false
        }
    ]);

    function addInventory(inventory:InventoryInterface): ApiResponse{
        if(!inventory.title || 
            !inventory.price_per_unity || 
            !inventory.qty_product || 
            !inventory.stock_value)
            return { message:"Preencha todos os campos obrigatórios",success:false } 
        setInventorys((oldInventorys)=>[...oldInventorys,inventory])
        return { message:"Produto Criado!", success:false }
    }

    function updateInventory(newInventory: InventoryInterface): ApiResponse {
    if (!newInventory.price_per_unity || !newInventory.qty_product) {
        return { message: "Preencha todos os campos obrigatórios", success: false };
    }
    const oldInventory = getInventoryById(newInventory.id);
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

    function getInventoryById(id:number){
        return inventorys.find((inventory)=>inventory.id==id) || null    
    }

    function removeInventoryById(id:number){
        const inventory = getInventoryById(id);
        if(!inventory) return {message:"Produto não encontrado",success:false}   
        setInventorys((oldInventorys)=>{
            return oldInventorys.filter((inventoryItem)=>inventoryItem.id!=id)
        }) 
        return {message:"Sucesso ao remover o produto",success:true}
    }

    return (
        <InventoryContext.Provider value={{inventorys,addInventory,getInventoryById,updateInventory,removeInventoryById}}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory(){
    const context = useContext(InventoryContext);
    if(context===undefined) throw Error("Contexto de inventorys não criado");
    return context;
}