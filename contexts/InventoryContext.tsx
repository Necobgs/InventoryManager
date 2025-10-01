import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse } from "@/interfaces/ApiResponse";
import InventoryInterface from "@/interfaces/InventoryInterface";
import { InventoryFormType } from "@/types/InventoryFormType";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface InventoryContextType {
  inventorys: InventoryInterface[];
  addInventory: (inventory: InventoryFormType) => ApiResponse;
  getInventoryBy: <T extends keyof InventoryInterface>(
    By: T,
    value: InventoryInterface[T]
  ) => InventoryInterface[];
  filterInventory: (enabled: boolean, description: string) => InventoryInterface[];
  updateInventory: (inventory: InventoryInterface) => ApiResponse;
  disableOrEnable: (id: number) => ApiResponse;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export default function InventoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inventorys, setInventorys] = useState<InventoryInterface[]>([]);

  useEffect(() => {
    async function loadData() {
      const newInventorys = await getInventorysStorage();
      setInventorys(newInventorys);
    }
    loadData();
  },[]);

  function addInventory(newInventory: InventoryFormType): ApiResponse {
    if (
      !newInventory.title ||
      !newInventory.description ||
      !newInventory.price_per_unity ||
      newInventory.price_per_unity <= 0
    ) {
      return { message: "Preencha todos os campos obrigatórios", success: false };
    }

    setInventorys((oldInventorys) => {

      const newId = !oldInventorys[0] ? 1 : oldInventorys.reduce((max, current) => current.id > max.id ? current : max).id + 1;

      const newInventorys = [
        ...oldInventorys,
        {
          ...newInventory,
          id: newId,
          stock_value: newInventory.price_per_unity * newInventory.qty_product,
          enabled: true,
        } as InventoryInterface,
      ]
      setInventorysStorage(newInventorys);
      return newInventorys;
    });

    return { message: "Produto criado!", success: true };
  }

  function updateInventory(newInventory: InventoryInterface): ApiResponse {
    if (!newInventory.price_per_unity) {
      return { message: "Preencha todos os campos obrigatórios", success: false };
    }

    const oldInventory = getInventoryBy("id", newInventory.id);
    if (oldInventory.length === 0) {
      return { message: "Produto inexistente", success: false };
    }

    const updatedInventory = {
      ...newInventory,
      stock_value: newInventory.price_per_unity * newInventory.qty_product,
    };

    setInventorys((oldInventorys) => {
      const newInventorys = oldInventorys.map((inventory) =>
        inventory.id === newInventory.id ? updatedInventory : inventory
      );

      setInventorysStorage(newInventorys);
      return newInventorys;
    });

    return { message: "Produto atualizado!", success: true };
  }

  function getInventoryBy<T extends keyof InventoryInterface>(
    By: T,
    value: InventoryInterface[T]
  ) {
    return inventorys.filter((inventory) => inventory[By] === value);
  }

  function filterInventory(enabled: boolean, description: string){
    return inventorys.filter((inventory)=> inventory["enabled"] == enabled && inventory["description"].toLocaleLowerCase().includes(description.trim().toLocaleLowerCase()));
  }

  function disableOrEnable(id: number): ApiResponse {
    const inventory = getInventoryBy("id", id);
    if (inventory.length === 0) {
      return { message: "Produto não encontrado", success: false };
    }

    setInventorys((oldInventorys) => {
      const newInventorys = oldInventorys.map((inventoryItem) =>
        inventoryItem.id === id
          ? { ...inventoryItem, enabled: !inventoryItem.enabled }
          : inventoryItem
      );

      setInventorysStorage(newInventorys);
      return newInventorys;
    });

    return { message: "Sucesso", success: true };
  }

  async function setInventorysStorage(newInventorys: InventoryInterface[]) {
    await AsyncStorage.setItem("inventorys", JSON.stringify(newInventorys));
  }

  async function getInventorysStorage(): Promise<InventoryInterface[]> {
    const data_json = await AsyncStorage.getItem("inventorys");
    const data: InventoryInterface[] = data_json ? JSON.parse(data_json) : [];
    return data;
  }

  return (
    <InventoryContext.Provider
      value={{
        inventorys,
        addInventory,
        getInventoryBy,
        filterInventory,
        updateInventory,
        disableOrEnable,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("Contexto de inventário não criado");
  }
  return context;
}