import { ApiResponse } from "@/interfaces/ApiResponse";
import { SupplierInterface } from "@/interfaces/SupplierInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface SupplierContextType {
    suppliers: SupplierInterface[],
    addSupplier: (data:SupplierInterface)=> ApiResponse,
    updateSupplier: (data:SupplierInterface)=> ApiResponse,
    disableOrEnable: (id:number)=> ApiResponse,
    getSuppliersBy<T extends keyof SupplierInterface>(
        By: T,
        value: SupplierInterface[T]
    ): SupplierInterface[],
    filterSupplier: (enabled: boolean, name: string, cnpj: string) => SupplierInterface[];
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export default function SupplierProvider({children}:{children:React.ReactNode}) {

    const [suppliers, setSuppliers] = useState<SupplierInterface[]>([]);

    useEffect(() => {
        async function loadData() {
            const newSuppliers = await getSuppliersStorage();
            setSuppliers(newSuppliers);
        }
        loadData();
    },[]);

    function addSupplier(data: SupplierInterface): ApiResponse {

        setSuppliers((oldSuppliers) => {
            const newId = !oldSuppliers[0] ? 1 : oldSuppliers.reduce((max, current) => current.id > max.id ? current : max).id + 1;

            const newSuppliers = [
                ...oldSuppliers,
                {
                    ...data,
                    id: newId,
                }
            ];

            setSuppliersStorage(newSuppliers);
            return newSuppliers;
        })

        return { message: "Fornecedor cadastrado com sucesso!", success: true };
    }

    function updateSupplier(data: SupplierInterface): ApiResponse {

        setSuppliers((oldSuppliers) => {
            const newSuppliers = oldSuppliers.map((vobj) => {
                return vobj.id === data.id ? {...vobj, ...data} : vobj;
            });

            setSuppliersStorage(newSuppliers);
            return newSuppliers;
        });

        return { message: "Fornecedor alterado com sucesso!", success: true };
    }

    function disableOrEnable(id: number): ApiResponse {

        const supplier = getSuppliersBy("id", id);

        if (supplier.length === 0) {
         return { message: "Fornecedor não encontrado", success: false };
        }

        setSuppliers((oldSuppliers) => {
            const newSuppliers= oldSuppliers.map((vobj) => {
                return vobj.id === id ? {...vobj, enabled: !vobj.enabled } : vobj;
            });

            setSuppliersStorage(newSuppliers);
            return newSuppliers;
        });

        return { message: "Sucesso", success: true };
    }

    function getSuppliersBy<T extends keyof SupplierInterface>(
        By: T,
        value: SupplierInterface[T]
        ): SupplierInterface[] {
        return suppliers.filter((supplier) => supplier[By] === value);
    }

    function filterSupplier(enabled: boolean, name: string, cnpj: string){
        return suppliers.filter((supplier)=> supplier["enabled"] == enabled && supplier["cnpj"] == (!cnpj ? supplier["cnpj"] : cnpj) && supplier["name"].toLocaleLowerCase().includes(name.trim().toLocaleLowerCase()));
    }

    async function setSuppliersStorage(newSuppliers: SupplierInterface[]) {
        await AsyncStorage.setItem("suppliers", JSON.stringify(newSuppliers));
    }

    async function getSuppliersStorage(): Promise<SupplierInterface[]> {
        const data_json = await AsyncStorage.getItem("suppliers");
        const data: SupplierInterface[] = data_json ? JSON.parse(data_json) : [];
        return data;
    }

    return (
        <SupplierContext.Provider value={{suppliers, addSupplier, updateSupplier, disableOrEnable, getSuppliersBy, filterSupplier}}>
            {children}
        </SupplierContext.Provider>
    )
}

export function useSupplier(){
    const context = useContext(SupplierContext);
    if(context===undefined) throw Error("Contexto de forncedores não criado");
    return context;
}