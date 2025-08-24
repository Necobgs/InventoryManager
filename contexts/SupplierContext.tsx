import { ApiResponse } from "@/interfaces/ApiResponse";
import { SupplierInterface } from "@/interfaces/SupplierInterface";
import { createContext, useContext, useState } from "react";

interface SupplierContextType {
    suppliers: SupplierInterface[],
    addSupplier: (data:SupplierInterface)=> ApiResponse,
    updateSupplier: (data:SupplierInterface)=> ApiResponse,
    removeSupplierById: (id:number)=> ApiResponse,
    getSuppliersBy<T extends keyof SupplierInterface>(
        By: T,
        value: SupplierInterface[T]
    ): SupplierInterface[]
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export default function SupplierProvider({children}:{children:React.ReactNode}) {

    const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);

    function addSupplier(data: SupplierInterface): ApiResponse {

        const newId = !suppliers[0] ? 1 : suppliers.reduce((max, current) => current.id > max.id ? current : max).id + 1;
        
        setSuppliers((oldSuppliers) => {
            return [
                ...oldSuppliers,
                {
                    ...data,
                    id: newId,
                }
            ];
        })


        return { message: "Fornecedor cadastrado com sucesso!", success: true };
    }

    function updateSupplier(data: SupplierInterface): ApiResponse {

        const newSuppliers: SupplierInterface[] = suppliers.map((vobj) => {
            return vobj.id === data.id ? {...vobj, ...data} : vobj;
        })

        setSuppliers(newSuppliers);

        return { message: "Fornecedor alterado com sucesso!", success: true };
    }

    function removeSupplierById(id: number): ApiResponse {

        const newSuppliers: SupplierInterface[] = suppliers.filter(vobj => vobj.id !== id);
        
        setSuppliers(newSuppliers);

        return { message: "Forncedor removido com sucesso!", success: true };
    }

    function getSuppliersBy<T extends keyof SupplierInterface>(
        By: T,
        value: SupplierInterface[T]
        ): SupplierInterface[] {
        return suppliers.filter((supplier) => supplier[By] === value);
    }

    return (
        <SupplierContext.Provider value={{suppliers, addSupplier, updateSupplier, removeSupplierById, getSuppliersBy}}>
            {children}
        </SupplierContext.Provider>
    )
}

export function useSupplier(){
    const context = useContext(SupplierContext);
    if(context===undefined) throw Error("Contexto de forncedores não criado");
    return context;
}