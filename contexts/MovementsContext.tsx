import { createContext, useContext, useState } from "react";
import { useInventory } from "./InventoryContext";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { MovementsInterface } from "@/interfaces/MovementsInterface";

interface MovementsContextType {
    movements: MovementsInterface[],
    addMovement: (data:MovementsInterface)=> ApiResponse,
    updateMovement: (data:MovementsInterface)=> ApiResponse,
    disableMovementById: (id:number)=> ApiResponse,
    getMovementsBy<T extends keyof MovementsInterface>(
        By: T,
        value: MovementsInterface[T]
    ): MovementsInterface[]
}

const MovementsContext = createContext<MovementsContextType | undefined>(undefined);

export default function MovementsProvider({children}:{children:React.ReactNode}) {

    const inventoryContext = useInventory();

    const [movements, setMovements] = useState<MovementsInterface[]>([
]);

    function addMovement(data: MovementsInterface): ApiResponse {
        if (!data.quantity) {
            return { message: "Preencha todos os campos obrigatórios", success: false };
        }

        const iventory = inventoryContext.getInventoryBy('id', data.id_inventory)?.[0];

        if (!iventory) {
            return { message: "Produto inexistente", success: false };
        }

        if (iventory.qty_product < data.quantity) {
             return { message: "Não há estoque suficiente para movimentar este produto", success: false };
        }

        iventory.qty_product -= data.quantity;
        iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

        const response = inventoryContext.updateInventory(iventory);

        if (!response.success) {
            return response;
        }

        const newId = !movements[0] ? 1 : movements.reduce((max, current) => current.id > max.id ? current : max).id + 1;
        const newValue = iventory.price_per_unity * data.quantity;

        setMovements((oldMovements) => {
            return [
                ...oldMovements,
                {
                    ...data,
                    id: newId,
                    value: newValue,
                    price_at_time: iventory.price_per_unity
                }
            ];
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
                let vqty_product = iventory.qty_product + moviment.quantity;

                if (vqty_product < data.quantity) {
                    return { message: "Não há estoque suficiente para movimentar este produto", success: false };
                }

                iventory.qty_product = vqty_product - data.quantity;
                iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

                const response = inventoryContext.updateInventory(iventory);

                if (!response.success) {
                    return response;
                }
            }
        } else {
            if (iventory.qty_product < data.quantity) {
                return { message: "Não há estoque suficiente para movimentar este produto", success: false };
            }

            const oldIventory = inventoryContext.getInventoryBy('id', moviment.id_inventory)?.[0];

            if (!oldIventory) {
                return { message: "O produto anteriormente relacionado à movimentação não existe mais", success: false };
            }

            let vqty_product = oldIventory.qty_product + moviment.quantity;

            oldIventory.qty_product = vqty_product;
            oldIventory.stock_value = oldIventory.qty_product * oldIventory.price_per_unity;

            const oldResponse = inventoryContext.updateInventory(oldIventory);

            if (!oldResponse.success) {
                return oldResponse;
            }

            iventory.qty_product -= data.quantity;
            iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

            const response = inventoryContext.updateInventory(iventory);

            if (!response.success) {
                return response;
            }
        }

        const newValue = iventory.price_per_unity * data.quantity;

        const newMovements: MovementsInterface[] = movements.map((vobj) => {
            return vobj.id === data.id ? {...vobj, ...data, value: newValue, price_at_time: iventory.price_per_unity} : vobj;
        })

        setMovements(newMovements);

        return { message: "Movimentação alterada com sucesso!", success: true };
    }


    function disableMovementById(id: number): ApiResponse {
        const moviment = getMovementsBy("id", id)?.[0];

        if (!moviment) {
            return { message: "Movimentação inexistente", success: false };
        }

        const iventory = inventoryContext.getInventoryBy('id', moviment.id_inventory)?.[0];

        if (!iventory) {
            return { message: "O produto relacionado à movimentação não existe mais", success: false };
        }

        let vqty_product = iventory.qty_product + moviment.quantity;

        iventory.qty_product = vqty_product;
        iventory.stock_value = iventory.qty_product * iventory.price_per_unity;

        const response = inventoryContext.updateInventory(iventory);

        if (!response.success) {
            return response;
        }

        const newMovements: MovementsInterface[] = movements.filter(vobj => vobj.id !== id);

        setMovements(newMovements);

        return { message: "Movimentação removida com sucesso!", success: true };
    }

    function getMovementsBy<T extends keyof MovementsInterface>(
        By: T,
        value: MovementsInterface[T]
      ): MovementsInterface[] {
        return movements.filter((movement) => movement[By] === value);
    }

    return (
        <MovementsContext.Provider value={{movements, addMovement, updateMovement, disableMovementById, getMovementsBy}}>
            {children}
        </MovementsContext.Provider>
    )
}

export function useMovements(){
    const context = useContext(MovementsContext);
    if(context===undefined) throw Error("Contexto de movimentações não criado");
    return context;
}