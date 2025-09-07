import { createContext, useContext, useEffect, useState } from "react";
import { useInventory } from "./InventoryContext";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { MovementsInterface } from "@/interfaces/MovementsInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MovementsContextType {
    movements: MovementsInterface[],
    addMovement: (data:MovementsInterface)=> ApiResponse,
    updateMovement: (data:MovementsInterface)=> ApiResponse,
    removeMovementById: (id:number)=> ApiResponse,
    getMovementsBy<T extends keyof MovementsInterface>(
        By: T,
        value: MovementsInterface[T]
    ): MovementsInterface[],
    getMovementsByOperation(operation:number): MovementsInterface[]
}

const MovementsContext = createContext<MovementsContextType | undefined>(undefined);

export default function MovementsProvider({children}:{children:React.ReactNode}) {

    const inventoryContext = useInventory();

    const [movements, setMovements] = useState<MovementsInterface[]>([]);

    useEffect(() => {
        async function loadData() {
          const newMovements = await getMovementsStorage();
          setMovements(newMovements);
        }
        loadData();
    },[]);

    function addMovement(data: MovementsInterface): ApiResponse {
        if (!data.quantity) {
            return { message: "Preencha todos os campos obrigatórios", success: false };
        }

        const iventory = inventoryContext.getInventoryBy('id', data.id_inventory)?.[0];

        if (!iventory) {
            return { message: "Produto inexistente", success: false };
        }

        if ((data.quantity < 0) && (iventory.qty_product < Math.abs(data.quantity))) {
            return { message: "Não há estoque suficiente para efetuar a saída deste produto", success: false };
        }

        iventory.qty_product += data.quantity;
        iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

        const response = inventoryContext.updateInventory(iventory);

        if (!response.success) {
            return response;
        }

        const newValue = iventory.price_per_unity * Math.abs(data.quantity);

        setMovements((oldMovements) => {

            const newId = !oldMovements[0] ? 1 : oldMovements.reduce((max, current) => current.id > max.id ? current : max).id + 1;

            const newMovements = [
                ...oldMovements,
                {
                    ...data,
                    id: newId,
                    value: newValue,
                    price_at_time: data.quantity < 0 ? iventory.price_per_unity : data.price_at_time
                }
            ];

            setMovementsStorage(newMovements);
            return newMovements;
        })

        return { message: "Movimentação cadastrada com sucesso!", success: true };
    }

    function updateMovement(data: MovementsInterface): ApiResponse {
        if (!data.quantity) {
            return { message: "Preencha todos os campos obrigatórios", success: false };
        }

        const moviment = getMovementsBy("id", data.id)?.[0];

        if (!moviment) {
            return { message: "Movimentação inexistente", success: false };
        }

        const iventory = inventoryContext.getInventoryBy('id', data.id_inventory)?.[0];

        if (!iventory) {
            return { message: "Produto inexistente", success: false };
        }

        if (moviment.id_inventory === data.id_inventory) {
            if (moviment.quantity !== data.quantity) {

                let vqty_product = iventory.qty_product - moviment.quantity;
                vqty_product += data.quantity;

                if (vqty_product < 0) {
                    return { message: "Não há estoque suficiente para movimentar este produto", success: false };
                }

                iventory.qty_product = vqty_product;
                iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

                const response = inventoryContext.updateInventory(iventory);

                if (!response.success) {
                    return response;
                }
            }
        } else {
            if ((data.quantity < 0) && (iventory.qty_product < Math.abs(data.quantity))) {
                return { message: "Não há estoque suficiente para efetuar a saída deste produto", success: false };
            }

            const oldIventory = inventoryContext.getInventoryBy('id', moviment.id_inventory)?.[0];

            if (!oldIventory) {
                return { message: "O produto anteriormente relacionado à movimentação não existe mais", success: false };
            }

            let vqty_product = oldIventory.qty_product - moviment.quantity;

            if (vqty_product < 0) {
                return { message: "Não é possível realizar essa movimentação, pois a quantidade do produto antigo ficará negativa", success: false };
            }

            oldIventory.qty_product = vqty_product;
            oldIventory.stock_value = oldIventory.qty_product * oldIventory.price_per_unity;

            const oldResponse = inventoryContext.updateInventory(oldIventory);

            if (!oldResponse.success) {
                return oldResponse;
            }

            iventory.qty_product += data.quantity;
            iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

            const response = inventoryContext.updateInventory(iventory);

            if (!response.success) {
                return response;
            }
        }

        const newValue = iventory.price_per_unity * Math.abs(data.quantity);

        setMovements((oldMovements) => {
            const newMovements = oldMovements.map((vobj) => {
                return vobj.id === data.id ? {...vobj, ...data, value: newValue, price_at_time: data.quantity < 0 ? iventory.price_per_unity : data.price_at_time} : vobj;
            });

            setMovementsStorage(newMovements);
            return newMovements;
        });

        return { message: "Movimentação alterada com sucesso!", success: true };
    }


    function removeMovementById(id: number): ApiResponse {
        const moviment = getMovementsBy("id", id)?.[0];

        if (!moviment) {
            return { message: "Movimentação inexistente", success: false };
        }

        const iventory = inventoryContext.getInventoryBy('id', moviment.id_inventory)?.[0];

        if (!iventory) {
            return { message: "O produto relacionado à movimentação não existe mais", success: false };
        }

        let vqty_product = iventory.qty_product - moviment.quantity;

        if (vqty_product < 0) {
            return { message: "Não há estoque suficiente para excluir essa movimentação", success: false};
        }

        iventory.qty_product = vqty_product;
        iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

        const response = inventoryContext.updateInventory(iventory);

        if (!response.success) {
            return response;
        }

        setMovements((oldMovements) => {
            const newMovements = oldMovements.filter(vobj => vobj.id !== id);

            setMovementsStorage(newMovements);
            return newMovements;
        });

        return { message: "Movimentação removida com sucesso!", success: true };
    }

    function getMovementsBy<T extends keyof MovementsInterface>(
        By: T,
        value: MovementsInterface[T]
      ): MovementsInterface[] {
        return movements.filter((movement) => movement[By] === value);
    }

    function getMovementsByOperation(operation:number): MovementsInterface[] {
        if (operation === 1) {
            return movements.filter((movement) => movement["quantity"] > 0);
        }
        else {
            return movements.filter((movement) => movement["quantity"] < 0);
        }
    }

    async function setMovementsStorage(newMovements: MovementsInterface[]) {
        await AsyncStorage.setItem("movements", JSON.stringify(newMovements));
    }

    async function getMovementsStorage(): Promise<MovementsInterface[]> {
        const data_json = await AsyncStorage.getItem("movements");
        const data: MovementsInterface[] = data_json ? JSON.parse(data_json) : [];
        const movements = data.map((m: any) => ({ ...m, date: new Date(m.date) }));
        return movements;
    }

    return (
        <MovementsContext.Provider value={{movements, addMovement, updateMovement, removeMovementById, getMovementsBy, getMovementsByOperation}}>
            {children}
        </MovementsContext.Provider>
    )
}

export function useMovements(){
    const context = useContext(MovementsContext);
    if(context===undefined) throw Error("Contexto de movimentações não criado");
    return context;
}